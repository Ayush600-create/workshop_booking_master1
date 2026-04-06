"""workshop_portal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, re_path, include
from django.conf.urls.static import static
from django.contrib import admin
from workshop_portal import views
from workshop_app import views as views_app
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/', include('workshop_app.api_urls')),
    re_path(r'^statistics/', include('statistics_app.urls')),

    # Temporary legacy routes for "Before" screenshots
    re_path(r'^legacy/$', views_app.index, name='legacy_index'),
    re_path(r'^legacy/login/$', views_app.user_login, name='legacy_login'),
    re_path(r'^legacy/register/$', views_app.user_register, name='legacy_register'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Catch-all MUST be last and must not capture static/media/api/admin routes.
urlpatterns += [
    re_path(r'^(?!api/|admin/|static/|data/|statistics/|legacy/).*$', views.react_index, name='react_index'),
]
