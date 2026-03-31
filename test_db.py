import os
import django
from django.db import connections
from django.db.utils import OperationalError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def check_db():
    db_conn = connections['default']
    try:
        db_conn.cursor()
    except OperationalError:
        print("Database connection failed!")
    else:
        print("Database connection successful!")

if __name__ == '__main__':
    check_db()
