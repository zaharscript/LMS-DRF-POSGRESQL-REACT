import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lms.views import GoogleLoginView
print("Successfully imported GoogleLoginView")
