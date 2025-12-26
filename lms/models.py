from django.db import models


from django.conf import settings

class Course(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="courses",
        null=True,
        blank=True
    )

    title = models.CharField(max_length=255)
    instructor = models.CharField(max_length=255)
    provider = models.CharField(max_length=255, blank=True, null=True)
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