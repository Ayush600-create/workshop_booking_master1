"""workshop_portal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from workshop_portal import views
from workshop_app import views as views_app
from django.conf import settings


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('workshop_app.api_urls')),
    
    # Temporary legacy routes for "Before" screenshots
    url(r'^legacy/$', views_app.index, name='legacy_index'),
    url(r'^legacy/login/$', views_app.user_login, name='legacy_login'),
    url(r'^legacy/register/$', views_app.user_register, name='legacy_register'),
    
    url(r'^.*$', views.react_index, name='react_index'),
    url(r'^statistics/', include('statistics_app.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Catch-all MUST be last and should ideally not match static/media/api/admin
urlpatterns += [
    url(r'^.*$', views.react_index),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
