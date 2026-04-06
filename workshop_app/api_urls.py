from django.urls import path
from . import api_views

app_name = 'workshop_api'

urlpatterns = [
    path('csrf/', api_views.get_csrf_token, name='csrf'),
    path('me/', api_views.me, name='me'),
    path('login/', api_views.api_login, name='login'),
    path('logout/', api_views.api_logout, name='logout'),
    path('register/', api_views.api_register, name='register'),
    path('workshops/', api_views.workshops_list, name='workshops_list'),
    path('workshops/<int:workshop_id>/', api_views.workshop_detail, name='workshop_detail'),
    path('workshops/propose/', api_views.propose_workshop, name='propose_workshop'),
    path('workshops/<int:workshop_id>/accept/', api_views.accept_workshop, name='accept_workshop'),
    path('workshop-types/', api_views.workshop_types, name='workshop_types'),
    path('profile/', api_views.profile_detail, name='profile_detail'),
]
