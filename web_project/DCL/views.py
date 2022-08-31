from multiprocessing import context
from django.shortcuts import render

# Create your views here.
def home(request):
    context = {}
    return(render(request, 'html/home.html', context=context))

def dcl_app(request):
    context = {}
    return(render(request, 'html/dcl_app.html', context=context))

def student(request):
    context = {}
    return(render(request, 'html/student.html', context=context))

def teacher(request):
    context = {}
    return(render(request, 'html/teacher.html', context=context))

