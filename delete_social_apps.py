import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from allauth.socialaccount.models import SocialApp

def cleanup():
    print("Deleting all SocialApp records to resolve conflict with settings.py...")
    deleted_count, _ = SocialApp.objects.filter(provider='google').delete()
    print(f"Deleted {deleted_count} 'google' SocialApp records.")

if __name__ == '__main__':
    cleanup()
