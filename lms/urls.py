from django.urls import path
from .views import (
    me,
    RegisterView,
    CourseListCreateView,
    CourseDetailView,
    SectionListCreateView,
    SectionDetailView,
    GoogleLoginView,
    TopicListCreateView,
    TopicDetailView,
    SyllabusImportView,
)

urlpatterns = [
    # 🔐 Auth / User
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", me, name="me"),

    # 📚 Courses
    path("courses/", CourseListCreateView.as_view(), name="course-list"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    path("courses/<int:pk>/import-syllabus/", SyllabusImportView.as_view(), name="import-syllabus"),

    # 📂 Sections
    path("sections/", SectionListCreateView.as_view(), name="section-list"),
    path("sections/<int:pk>/", SectionDetailView.as_view(), name="section-detail"),

    # 🧩 Topics
    path("topics/", TopicListCreateView.as_view(), name="topic-list"),
    path("topics/<int:pk>/", TopicDetailView.as_view(), name="topic-detail"),
]
