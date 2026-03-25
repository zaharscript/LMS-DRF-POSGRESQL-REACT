import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from allauth.socialaccount.models import SocialApp

apps = list(SocialApp.objects.filter(provider='google'))
print(f"Found {len(apps)} google apps.")

for i, app in enumerate(apps):
    print(f"App {i+1}: ID={app.id}, Name={app.name}, ClientID={app.client_id}")

if len(apps) > 1:
    print("Deleting all but the first one...")
    for app in apps[1:]:
        print(f"Deleting app ID={app.id}")
        app.delete()
    print("Done.")
elif len(apps) == 0:
    print("No google app found in the DB. Ensure settings.py is sufficient or create one.")
else:
    print("Only one app found. No duplicates.")
