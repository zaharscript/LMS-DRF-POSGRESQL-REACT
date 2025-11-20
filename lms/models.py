from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=255)
    instructor = models.CharField(max_length=255)
    date_joined = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Section(models.Model):
    course = models.ForeignKey(
        Course, related_name="sections", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Topic(models.Model):
    section = models.ForeignKey(
        Section, related_name="topics", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.section.title} - {self.title}"
