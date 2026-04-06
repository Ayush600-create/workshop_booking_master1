import os
import sys
from django.core.wsgi import get_wsgi_application

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Set Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "workshop_portal.settings")

# Get WSGI application
app = get_wsgi_application()

# Vercel expects this
application = app