import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
from django.conf import settings

def find_duplicates():
    print("--- ALL SOCIAL APPS ---")
    apps = SocialApp.objects.all()
    for app in apps:
        print(f"ID={app.id}, Provider={app.provider}, Name={app.name}, ClientID={app.client_id[:15]}...")
        sites = app.sites.all()
        if sites:
            print(f"  Linked to Sites: {[f'ID={s.id} ({s.domain})' for s in sites]}")
        else:
            print("  Linked to NO sites")

    print("\n--- ALL SITES ---")
    for site in Site.objects.all():
        print(f"ID={site.id}, Domain={site.domain}, Name={site.name}")

if __name__ == '__main__':
    find_duplicates()
