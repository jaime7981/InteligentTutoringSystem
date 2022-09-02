from multiprocessing import context
from django.shortcuts import render
from usercontrol.decorator import allowed_users

# Create your views here.
def home(request):
    context = {}
    return(render(request, 'home.html', context=context))

@allowed_users(allowed_roles=['student', 'teacher'])
def dcl_app(request):
    context = {}
    return(render(request, 'dcl_app.html', context=context))

@allowed_users(allowed_roles=['student'])
def student(request):
    context = {}
    return(render(request, 'student.html', context=context))

@allowed_users(allowed_roles=['teacher'])
def teacher(request):
    context = {}
    return(render(request, 'teacher.html', context=context))

