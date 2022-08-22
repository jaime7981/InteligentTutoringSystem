from django.views.generic import RedirectView
from django.urls import path
from . import views

urlpatterns = [
    #path('', RedirectView.as_view(url='/accounts/login/')),
    path('', views.home, name = 'home'),
]