from multiprocessing import context
from django.shortcuts import render, redirect
from usercontrol.decorator import allowed_users
from .models import Assignment
from usercontrol.models import Teacher, Classroom, Student
from django.contrib import messages
from datetime import date
from django.contrib.auth.models import User

# Create your views here.
def home(request):
    context = {}
    return(render(request, 'home.html', context=context))

@allowed_users(allowed_roles=['teacher'])
def dcl_app(request):
    if request.method == "POST" and is_ajax(request):
        if not request.user.is_superuser:
            if request.POST.get('assignment_name') == '':
                name = 'Assignment ' + str(len(Assignment.objects.all()) + 1)
            else:
                name = request.POST.get('assignment_name')
            if request.POST.get('assignment_description') == '':
                description = 'No description'
            else:
                description = request.POST.get('assignment_description')
            if request.POST.get('assignment_id') == "0":
                current_teacher = Teacher.objects.get(user = request.user)
                Assignment.objects.create(name = name,
                                        description = description,
                                        level = request.POST.get('assignment_level'),
                                        teacher = current_teacher,
                                        dcl_json = request.POST.get('assignment_data'),
                                        photo = request.FILES.get('assignment_photo', None))
                messages.success(request, 'Assignment succesfully Created')
            else:
                current_asignment = Assignment.objects.get(pk = request.POST.get('assignment_id'))
                current_asignment.name = name
                current_asignment.description = description
                current_asignment.level = request.POST.get('assignment_level')
                current_asignment.dcl_json = request.POST.get('assignment_data')
                current_asignment.photo = request.FILES.get('assignment_photo', None)
                current_asignment.save()
                messages.success(request, 'Assignment succesfully Updated')
        else:
            messages.error(request, 'Superusers cant save assignments, only teachers')
        return redirect('home')

    context = {}
    return(render(request, 'dcl_app.html', context=context))

@allowed_users(allowed_roles=['student'])
def student(request):
    current_student = Student.objects.get(user = request.user)
    all_teachers = Teacher.objects.all()
    if request.method == "POST" and is_ajax(request):
        if not request.user.is_superuser:
            selected_teacher = request.POST.get('selected_teacher')
            current_teacher = Teacher.objects.get(user = User.objects.get(username = selected_teacher))

            if not Classroom.objects.filter(student = current_student).filter(teacher = current_teacher).exists():
                Classroom.objects.create(name = current_teacher.user.username + '_classroom',
                                        student = current_student,
                                        teacher = current_teacher,
                                        date_joined = date.today())
                messages.success(request, 'Joined to teacher classroom')
            else:
                messages.error(request, 'Already in this classroom')
            return(render(request, 'student.html', context={}))

    student_classroom = Classroom.objects.filter(student = current_student)
    context = { "clasrooms" : student_classroom,
                "all_teachers" : all_teachers }
    return(render(request, 'student.html', context=context))

@allowed_users(allowed_roles=['student'])
def studentAssignment(request, teacher_id):
    assignments = Assignment.objects.filter(teacher = Teacher.objects.get(user = User.objects.get(username = teacher_id)))
    context = { "teacher_assignments" : assignments}
    return(render(request, 'student_assignments.html', context=context))

@allowed_users(allowed_roles=['student'])
def studentSolution(request, assignment_id):
    if assignment_id == 0:
        context = { "selected_assignment" : 0}
    else:
        assignment = Assignment.objects.get(pk = assignment_id)
        context = { "selected_assignment" : assignment}
    return(render(request, 'assignment_solution.html', context=context))

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
