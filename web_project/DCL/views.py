from multiprocessing import context
from django.shortcuts import render, redirect
from usercontrol.decorator import allowed_users

# Create your views here.
def home(request):
    context = {}
    return(render(request, 'home.html', context=context))

@allowed_users(allowed_roles=['teacher'])
def dcl_app(request):
    if request.method == "POST" and is_ajax(request):
        assaignment_data = request.POST.get('assignment_data')
        #Create assignment and link it to teacher
        print(assaignment_data)

        return redirect('home')

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

def test(request):
    context = { "test_value" : "controller passed value"}
    return(render(request, 'test.html', context=context))

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
