# lms/views.py
import os
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.conf import settings

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken

from django.db import transaction
from .utils.scraper import scrape_w3schools_syllabus
from .models import Course, Section, Topic
from .serializers import (
    RegisterSerializer,
    CourseSerializer,
    SectionSerializer,
    TopicSerializer,
)


# -------------------------
# AUTH
# -------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
    })


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class GoogleLoginView(APIView):
    """
    Accepts a Google ID Token (credential) from @react-oauth/google's GoogleLogin component.
    Verifies the token with Google, creates/gets the Django user, and returns JWT tokens.

    Expected request body:
        { "id_token": "<google_credential_jwt>" }
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get("id_token")
        if not token:
            return Response(
                {"error": "id_token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            client_id = settings.SOCIALACCOUNT_PROVIDERS["google"]["APP"]["client_id"]
            # Verify the token against Google's servers
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                client_id
            )
        except ValueError as e:
            return Response(
                {"error": f"Invalid Google token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = idinfo.get("email")
        if not email:
            return Response(
                {"error": "Email not found in Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")

        # Get or create the user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
            }
        )

        # Issue JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }, status=status.HTTP_200_OK)


# -------------------------
# COURSES
# -------------------------

class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(user=self.request.user)


# -------------------------
# SECTIONS
# -------------------------

class SectionListCreateView(generics.ListCreateAPIView):
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Section.objects.filter(course__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


class SectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Section.objects.filter(course__user=self.request.user)


# -------------------------
# TOPICS
# -------------------------

class TopicListCreateView(generics.ListCreateAPIView):
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Topic.objects.filter(section__course__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


class TopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Topic.objects.filter(section__course__user=self.request.user)


class SyllabusImportView(APIView):
    """
    POST /api/courses/<course_id>/import-syllabus/
    Body: { "url": "..." }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk, user=request.user)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        url = request.data.get("url")
        if not url:
            return Response({"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            syllabus_data = scrape_w3schools_syllabus(url)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                for sec_data in syllabus_data:
                    # Idempotency: get_or_create section
                    section, created = Section.objects.get_or_create(
                        course=course,
                        title=sec_data["title"]
                    )
                    
                    # Create topics if they don't exist for this section
                    for topic_title in sec_data["topics"]:
                        Topic.objects.get_or_create(
                            section=section,
                            title=topic_title
                        )
            
            # Return fresh course data with the new syllabus
            serializer = CourseSerializer(course)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Database error during import: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
