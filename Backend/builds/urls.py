from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PCBuildViewSet


router = DefaultRouter()
router.register(r"builds", PCBuildViewSet, basename="build")

urlpatterns = [
    path("", include(router.urls)),
]

