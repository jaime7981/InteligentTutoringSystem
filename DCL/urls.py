from django.urls import path
from . import views as dcl

urlpatterns = [
    #path('', RedirectView.as_view(url='/accounts/login/')),
    path('', dcl.home, name = 'home'),
]