#lms/views.py
import os
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

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


class GoogleLoginView(SocialLoginView):
    """
    Receives 'access_token' (which is the ID Token/credential) from React frontend (@react-oauth/google).
    """
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

    def post(self, request, *args, **kwargs):
        # Log the incoming data for debugging
        with open("oauth_debug.txt", "a") as f:
            f.write(f"\n--- GOOGLE IDENTITY SERVICES REQUEST ---\n")
            f.write(f"Data: {request.data}\n")
        
        response = super().post(request, *args, **kwargs)
        
        if response.status_code >= 400:
            with open("oauth_debug.txt", "a") as f:
                f.write(f"ERROR Response: {response.data}\n")
        return response


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
