from django.urls import path
from . import views as dcl

urlpatterns = [
    #path('', RedirectView.as_view(url='/accounts/login/')),
    path('', dcl.home, name = 'home'),
    path('app', dcl.dcl_app, name = 'app'),
    path('student', dcl.student, name = 'student'),
    path('teacher', dcl.teacher, name = 'teacher'),
    path('teacher/<int:assignment_id>/', dcl.teacherAssignment, name = 'teacher_assignment'),
    path('teacher/create_assignment', dcl.createAssignment, name = 'create_assignment'),
    path('test', dcl.test, name = 'test'),
]