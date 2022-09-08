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
            if request.POST.get('assignment_id') == "0":
                current_teacher = Teacher.objects.get(user = request.user)
                if request.POST.get('assignment_name') == '':
                    name = 'Assignment ' + str(len(Assignment.objects.all()) + 1)
                else:
                    name = request.POST.get('assignment_name')
                if request.POST.get('assignment_description') == '':
                    description = 'No description'
                else:
                    description = request.POST.get('assignment_description')
                Assignment.objects.create(name = name,
                                        description = description,
                                        level = request.POST.get('assignment_level'),
                                        teacher = current_teacher,
                                        dcl_json = request.POST.get('assignment_data'))
                messages.success(request, 'Assignment succesfully Created')
            else:
                current_asignment = Assignment.objects.get(pk = request.POST.get('assignment_id'))
                current_asignment.name = request.POST.get('assignment_name')
                current_asignment.description = request.POST.get('assignment_description')
                current_asignment.level = request.POST.get('assignment_level')
                current_asignment.dcl_json = request.POST.get('assignment_data')
                current_asignment.save()
                messages.success(request, 'Assignment succesfully Updated')
        else:
            messages.error(request, 'Superusers cant save assignments, only teachers')
        return redirect('home')

    context = {}
    return(render(request, 'dcl_app.html', context=context))

@allowed_users(allowed_roles=['student'])
def student(request):
    assignment_query = []
    assignment_query = Teacher.students.through.objects.all()

    context = { "assignment_list" : assignment_query}
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
    if assignment_id == 0:
        context = { "selected_assignment" : 0}
    else:
        assignment = Assignment.objects.get(pk = assignment_id)
        context = { "selected_assignment" : assignment}
    return(render(request, 'teacher_assignment.html', context=context))

def test(request):
    context = { "test_value" : "controller passed value"}
    return(render(request, 'test.html', context=context))

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
