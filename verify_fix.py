import os
import django
from django.test import RequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from allauth.socialaccount.adapter import get_adapter

def verify():
    adapter = get_adapter()
    request = RequestFactory().get('/')
    print("Attempting to retrieve 'google' social app...")
    try:
        app = adapter.get_app(request, provider='google')
        print(f"SUCCESS! Retrieved SocialApp: {app.name} (ID={app.client_id[:15]}...) from settings.")
    except Exception as e:
        print(f"FAILED! Still getting error: {type(e).__name__}: {e}")

if __name__ == '__main__':
    verify()
