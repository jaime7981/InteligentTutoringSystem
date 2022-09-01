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
    def wrapper_func(request, *args, **kargs):
        
        return redirect('home')
    return wrapper_func