#users/urls.py
from django.urls import path
from .views import CurrentUserView, ProfileView, ChangePasswordView, UpdateRoleView, DeleteAccountView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('current/', CurrentUserView.as_view(), name='current-user'),
    path("delete/", DeleteAccountView.as_view(), name="delete_account"),
    path('update-role/', UpdateRoleView.as_view(), name='update-role'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
]
