#vendors/urls.py
from django.urls import path
from .views import (
    ShopListCreateView,
    VendorDetailView,
    VendorBuildListCreateView,
    VendorBuildDetailView
)

urlpatterns = [
    path("shops/", ShopListCreateView.as_view(), name="shop-list-create"),
    path("vendor/", VendorDetailView.as_view(), name="vendor-detail"),
    path("builds/", VendorBuildListCreateView.as_view(), name="build-list-create"),
    path("builds/<int:pk>/", VendorBuildDetailView.as_view(), name="build-detail"),
]
