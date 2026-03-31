import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
from django.conf import settings

def check_db():
    print(f"SITE_ID: {getattr(settings, 'SITE_ID', 'Not Set')}")
    print("\n--- Sites ---")
    for site in Site.objects.all():
        print(f"ID={site.id}, Domain={site.domain}, Name={site.name}")
    
    print("\n--- Social Apps ---")
    for app in SocialApp.objects.all():
        print(f"Provider={app.provider}, Name={app.name}, ClientID={app.client_id[:10]}...")
        for site in app.sites.all():
            print(f"  Linked to Site: ID={site.id}, Domain={site.domain}")

if __name__ == '__main__':
    check_db()
