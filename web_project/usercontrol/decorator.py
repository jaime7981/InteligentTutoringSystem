from email import message
from django.shortcuts import redirect
from django.contrib import messages as log_message

def unauthenticated_user(child_func):
    def wrapper_func(request, *args, **kargs):
        if request.user.is_authenticated:
            return(redirect('home'))
        return child_func(request, *args, **kargs)
    return wrapper_func

def is_authenticated_user(child_func):
    def wrapper_func(request, *args, **kargs):
        if request.user.is_authenticated:
            return child_func(request, *args, **kargs)
        return(redirect('home'))
    return wrapper_func

def allowed_users(allowed_roles=[]):
	def decorator(view_func):
		def wrapper_func(request, *args, **kwargs):
			if request.user.is_superuser:
				return view_func(request, *args, **kwargs)
			group = None
			if request.user.groups.exists():
				group = request.user.groups.all()[0].name
				if group in allowed_roles:
					return view_func(request, *args, **kwargs)
				else:
					if group == 'teacher':
						log_message.error(request, 'You cant access student information')
					elif group == 'student':
						log_message.error(request, 'You cant access teacher information')
					else:
						log_message.error(request, 'You are not logged in or assigned to a user role')
			else:
				log_message.error(request, 'You are not assigned to a user role')
			return(redirect('home'))
		return wrapper_func
	return decorator
