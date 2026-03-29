from django.urls import path
from .views import UserSignupView, UserLoginView, MeView, reset_password, set_new_password, Contactus

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='user_signup'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('me/', MeView.as_view(), name='user_me'),
    path('reset-password/', reset_password.as_view(), name='reset_password'),
    path('set-new-password/', set_new_password.as_view(), name='set_new_password'),
    path('contact/', Contactus.as_view(), name='contact_us'),
]
