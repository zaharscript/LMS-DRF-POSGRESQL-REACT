import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.sites.models import Site

# 1. Clear the stale user that might be causing the 400 error
User.objects.filter(email="zahratulnazirah@gmail.com").delete()
print("Stale user cleared!")

# 2. Fix the Site record for Google OAuth
site = Site.objects.get_or_create(id=1)[0]
site.domain = "mystudyplan25.netlify.app"
site.name = "LMS Production"
site.save()
print(f"Site ID 1 updated to: {site.domain}")