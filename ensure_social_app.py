import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
from django.conf import settings

def setup_social_app():
    # 1. Setup Site
    site_id = getattr(settings, 'SITE_ID', 1)
    site, created = Site.objects.get_or_create(
        id=site_id, 
        defaults={"domain": "127.0.0.1:8000", "name": "127.0.0.1"}
    )
    if not created:
        site.domain = "127.0.0.1:8000"
        site.name = "127.0.0.1"
        site.save()
    print(f"Site configured: ID={site.id}, Domain={site.domain}")

    # 2. Setup SocialApp
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment!")
        return

    app, created = SocialApp.objects.get_or_create(
        provider='google',
        defaults={
            "name": "Google",
            "client_id": client_id,
            "secret": client_secret,
        }
    )
    
    if not created:
        app.client_id = client_id
        app.secret = client_secret
        app.save()
    
    app.sites.add(site)
    print(f"SocialApp configured: Provider={app.provider}, ClientID={app.client_id}")

if __name__ == '__main__':
    setup_social_app()
