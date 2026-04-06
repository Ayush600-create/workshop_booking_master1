from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Workshop, WorkshopType, Profile, Comment
from .forms import UserLoginForm, UserRegistrationForm, WorkshopForm, ProfileForm, CommentsForm
import json

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

def me(request):
    if request.user.is_authenticated:
        profile = getattr(request.user, 'profile', None)
        return JsonResponse({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'full_name': request.user.get_full_name(),
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'is_instructor': request.user.groups.filter(name='instructor').exists(),
                'position': profile.position if profile else 'coordinator',
            }
        })
    return JsonResponse({'authenticated': False})

@require_POST
def api_login(request):
    try:
        data = json.loads(request.body)
        u_name = data.get('username')
        pwd = data.get('password')
        user = authenticate(username=u_name, password=pwd)
    except:
        return JsonResponse({'success': False, 'message': 'Invalid request body'}, status=400)
        
    if user:
        if hasattr(user, 'profile') and user.profile.is_email_verified:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Logged in successfully'})
        elif not hasattr(user, 'profile') or not user.profile.is_email_verified:
            return JsonResponse({'success': False, 'needs_activation': True, 'message': 'Email not verified'})
    return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=401)

@require_POST
def api_logout(request):
    logout(request)
    return JsonResponse({'success': True})

@login_required
def workshops_list(request):
    user = request.user
    is_instructor = user.groups.filter(name='instructor').exists()
    
    if is_instructor:
        workshops = Workshop.objects.filter(instructor=user.id).order_by('-date')
        proposed = Workshop.objects.filter(status=0, tnc_accepted=True).order_by('-date')
        
        return JsonResponse({
            'accepted': [
                {
                    'id': w.id,
                    'workshop_type': w.workshop_type.name,
                    'coordinator_name': w.coordinator.get_full_name(),
                    'institute': w.coordinator.profile.institute,
                    'date': w.date.isoformat(),
                    'status': w.get_status(),
                } for w in workshops if w.status == 1
            ],
            'proposed': [
                {
                    'id': w.id,
                    'workshop_type': w.workshop_type.name,
                    'coordinator_name': w.coordinator.get_full_name(),
                    'institute': w.coordinator.profile.institute,
                    'date': w.date.isoformat(),
                    'status': w.get_status(),
                } for w in proposed
            ]
        })
    else:
        workshops = Workshop.objects.filter(coordinator=user.id).order_by('-date')
        return JsonResponse({
            'my_workshops': [
                {
                    'id': w.id,
                    'workshop_type': w.workshop_type.name,
                    'instructor_name': w.instructor.get_full_name() if w.instructor else 'Pending',
                    'date': w.date.isoformat(),
                    'status': w.get_status(),
                    'is_accepted': w.status == 1
                } for w in workshops
            ]
        })

def workshop_types(request):
    types = WorkshopType.objects.all().order_by('id')
    return JsonResponse({'types': [
        {
            'id': t.id,
            'name': t.name,
            'duration': t.duration,
            'description': t.description
        } for t in types
    ]})

@login_required
def profile_detail(request):
    user = request.user
    profile = user.profile
    return JsonResponse({
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'institute': profile.institute,
        'department': profile.department,
        'phone_number': profile.phone_number,
        'location': profile.location,
        'position': profile.position,
        'state': profile.state
    })

@require_POST
def api_register(request):
    try:
        data = json.loads(request.body)
        form = UserRegistrationForm(data)
        if form.is_valid():
            username, password, key = form.save()
            user = User.objects.get(username=username)
            user.profile.is_email_verified = True
            user.profile.save()
            
            # For demo, match group if position is instructor
            if form.cleaned_data.get('position') == 'instructor':
                from django.contrib.auth.models import Group
                group, _ = Group.objects.get_or_create(name='instructor')
                user.groups.add(group)
                
            login(request, user)
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)

@login_required
@require_POST
def propose_workshop(request):
    try:
        data = json.loads(request.body)
        # Handle form mapping manually for clean JSON
        w_type = WorkshopType.objects.get(id=data.get('workshop_type'))
        workshop = Workshop.objects.create(
            coordinator=request.user,
            workshop_type=w_type,
            date=data.get('date'),
            tnc_accepted=data.get('tnc_accepted', False)
        )
        return JsonResponse({'success': True, 'id': workshop.id})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)

@login_required
@require_POST
def accept_workshop(request, workshop_id):
    if not request.user.groups.filter(name='instructor').exists():
        return JsonResponse({'success': False, 'message': 'Instructor only'}, status=403)
    try:
        w = Workshop.objects.get(id=workshop_id)
        w.status = 1
        w.instructor = request.user
        w.save()
        return JsonResponse({'success': True})
    except Workshop.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found'}, status=404)

@login_required
def workshop_detail(request, workshop_id):
    try:
        w = Workshop.objects.get(id=workshop_id)
        comments = Comment.objects.filter(workshop=w).order_by('-created_date')
        return JsonResponse({
            'detail': {
                'id': w.id,
                'name': w.workshop_type.name,
                'coordinator': w.coordinator.get_full_name(),
                'instructor': w.instructor.get_full_name() if w.instructor else 'Pending',
                'date': w.date.isoformat(),
                'status': w.get_status(),
                'status_code': w.status,
                'description': w.workshop_type.description
            },
            'comments': [
                {
                    'author': c.author.get_full_name(),
                    'text': c.comment,
                    'date': c.created_date.isoformat(),
                    'public': c.public
                } for c in comments
            ]
        })
    except Workshop.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not found'}, status=404)
