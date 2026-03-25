import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
from django.conf import settings

# 1. Ensure Site ID=1 exists (Matches SITE_ID in settings.py)
site_id = getattr(settings, 'SITE_ID', 1)
site, created = Site.objects.get_or_create(id=site_id, defaults={"domain": "mystudyplan25.netlify.app", "name": "Production Dashboard"})
if created:
    print(f"Created Site ID={site_id}")
else:
    print(f"Site ID={site_id} already exists")

# 2. Delete all SocialApps from DB to prevent MultipleObjectsReturned
# Since allauth finds the APP from settings.py, having one in the DB causes duplicates.
apps = SocialApp.objects.all()
count = apps.count()
if count > 0:
    apps.delete()
    print(f"Deleted {count} SocialApp(s) from DB to prevent duplication with settings.py.")
else:
    print("No SocialApp records in DB (This is correct when using settings.py).")
