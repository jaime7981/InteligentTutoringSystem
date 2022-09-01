from django.urls import path
from . import views as usercontrol

urlpatterns = [
    #path('', RedirectView.as_view(url='/accounts/login/')),
    path('login', usercontrol.loginMeth, name = 'login'),
    path('registration', usercontrol.registration, name = 'registration'),
    path('logout', usercontrol.logoutMeth, name = 'logout'),
]