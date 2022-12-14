from django.urls import path
from . import views as dcl

urlpatterns = [
    #path('', RedirectView.as_view(url='/accounts/login/')),
    path('', dcl.home, name = 'home'),
    path('app', dcl.dcl_app, name = 'app'),
    path('student', dcl.student, name = 'student'),
    path('student/<str:teacher_id>/', dcl.studentAssignment, name = 'student_assignment'),
    path('student/profile/<str:student_username>/', dcl.studentPage, name = 'student_page'),
    path('solution/<str:assignment_id>/', dcl.studentSolution, name = 'student_solution'),
    path('frame/<str:assignment_id>/', dcl.frameSolution, name = 'solution_frame'),
    path('teacher', dcl.teacher, name = 'teacher'),
    path('teacher/<int:assignment_id>/', dcl.teacherAssignment, name = 'teacher_assignment'),
    path('test', dcl.test, name = 'test'),
]