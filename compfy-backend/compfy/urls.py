#compfy/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,)
from users.views import RegisterView


urlpatterns = [
    path('admin/', admin.site.urls),

   # Auth endpoints
    path('api/auth/signup/', RegisterView.as_view(), name='signup'), # keep this
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
 
  # Other apps
    path('api/users/', include('users.urls')),  # remove signup from users/urls.py
    path('api/vendors/', include('vendors.urls')),
    path('api/builds/', include('builds.urls')),
    path('api/utils/', include('utils.urls')),
    path("api/", include("vendors.urls")),  # make sure vendors app is included
    path('api/inventory/', include('inventory.urls')),
]
