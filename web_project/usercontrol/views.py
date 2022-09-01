from multiprocessing import context
from django.shortcuts import render

# Create your views here.

def login(request):
    context = {}
    return(render(request, 'login.html', context=context))

def registration(request):
    context = {}
    return(render(request, 'registration.html', context=context))
