from django.shortcuts import redirect

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

			group = None
			if request.user.groups.exists():
				group = request.user.groups.all()[0].name

			if group in allowed_roles:
				return view_func(request, *args, **kwargs)
			else:
				return redirect('home')
		return wrapper_func
	return decorator
