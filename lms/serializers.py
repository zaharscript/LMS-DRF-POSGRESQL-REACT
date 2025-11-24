from rest_framework import serializers
from .models import Course, Section, Topic


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'section', 'title', 'completed']   # <-- section added


class SectionSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ['id', 'course', 'title', 'topics']       # <-- course added


class CourseSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'instructor','provider', 'date_joined', 'sections']
