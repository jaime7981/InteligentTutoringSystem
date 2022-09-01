from multiprocessing import context
from django.shortcuts import render, redirect

from .decorator import unauthenticated_user, is_authenticated_user, allowed_users
from .forms import CreateUserForm, LoginUserForm
from django.contrib import messages

from django.contrib.auth import authenticate, login, logout

@unauthenticated_user
def loginMeth(request):
    login_form = LoginUserForm()
    if request.method == "POST":
        login_form = LoginUserForm(request.POST)
        if login_form.is_valid():
            user = authenticate(request, 
                                username=login_form.cleaned_data.get('username'), 
                                password=login_form.cleaned_data.get('password'))
            if user is not None:
                login(request, user)
                messages.success(request, f'Succesfuly loged')
                return(redirect('home'))
        messages.error(request, 'Failed Login')
        return(redirect('login'))

    context = { "login_form" : login_form}
    return(render(request, 'login.html', context=context))

@unauthenticated_user
def registration(request):
    user_form = CreateUserForm()
    if request.method == "POST":
        user_form = CreateUserForm(request.POST)
        if user_form.is_valid():
            user_form.save()
            user = user_form.cleaned_data.get('username')
            messages.success(request, f'Account succesfuly created for {user}')
            return(redirect('home'))
        else:
            messages.error(request, 'Confirm that the fields are correct')
            redirect('registration')
    
    context = { "user_form" : user_form }
    return(render(request, 'registration.html', context=context))

@is_authenticated_user
def logoutMeth(request):
    logout(request)
    messages.success(request, 'Succesfully loged out')
    context = {}
    return(redirect('login'))
