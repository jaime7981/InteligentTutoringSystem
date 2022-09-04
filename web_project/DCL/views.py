from multiprocessing import context
from unicodedata import name
from django.shortcuts import render, redirect
from usercontrol.decorator import allowed_users
from .models import Assignment
from usercontrol.models import Teacher
from django.contrib import messages

# Create your views here.
def home(request):
    context = {}
    return(render(request, 'home.html', context=context))

@allowed_users(allowed_roles=['teacher'])
def dcl_app(request):
    if request.method == "POST" and is_ajax(request):
        if not request.user.is_superuser:
            assignment_data = request.POST.get('assignment_data')
            current_teacher = Teacher.objects.get(user = request.user)
            Assignment.objects.create(name = 'default assignment name',
                                    level = 1,
                                    teacher = current_teacher,
                                    dcl_json = assignment_data)
            messages.success(request, 'Assignment succesfully saved')
        else:
            messages.error(request, 'Superusers cant save assignments, only teachers')
        return redirect('home')

    context = {}
    return(render(request, 'dcl_app.html', context=context))

@allowed_users(allowed_roles=['student'])
def student(request):
    context = {}
    return(render(request, 'student.html', context=context))

@allowed_users(allowed_roles=['teacher'])
def teacher(request):
    assignments = []

    if not request.user.is_superuser:
        current_teacher = Teacher.objects.get(user = request.user)
        assignments = Assignment.objects.filter(teacher = current_teacher).values()
    else:
        messages.error(request, 'Superusers cant save assignments, only teachers')
        return (redirect('home'))

    context = { "teacher_assignments" : assignments}
    return(render(request, 'teacher.html', context=context))

@allowed_users(allowed_roles=['teacher'])
def teacherAssignment(request, assignment_id):
    assignment = Assignment.objects.get(pk = assignment_id)
    context = { "selected_assignment" : assignment}
    return(render(request, 'assignment.html', context=context))

@allowed_users(allowed_roles=['teacher'])
def createAssignment(request):
    context = { }
    return(render(request, 'create_assignment.html', context=context))

def test(request):
    context = { "test_value" : "controller passed value"}
    return(render(request, 'test.html', context=context))

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
