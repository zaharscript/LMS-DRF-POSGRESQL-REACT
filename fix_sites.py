import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from allauth.socialaccount.models import SocialApp
from django.contrib.sites.models import Site
from django.conf import settings

site_id = getattr(settings, 'SITE_ID', 1)

# Ensure the site exists
site, created = Site.objects.get_or_create(id=site_id, defaults={"domain": "localhost:8000", "name": "localhost"})

# Link the first google SocialApp to this site
app = SocialApp.objects.filter(provider='google').first()
if app:
    app.sites.add(site)
    app.save()
    print(f"Successfully linked Site {site_id} to the Google SocialApp.")
else:
    print("No Google SocialApp found in DB.")
