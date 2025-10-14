#vendors/views.py
from rest_framework import generics, permissions, status
from .models import Vendor, VendorBuild
from rest_framework.exceptions import ValidationError  
from .serializers import VendorSerializer, VendorBuildSerializer
from rest_framework.response import Response

# ---------------- Vendor Views ----------------

class ShopListCreateView(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if Vendor.objects.filter(user=self.request.user).exists():
            raise ValidationError({"detail": "You already have a registered shop."})
        serializer.save(user=self.request.user)



class VendorDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update the logged-in vendor
    """
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.vendor


# ---------------- VendorBuild Views ----------------

class VendorBuildListCreateView(generics.ListCreateAPIView):
    """
    List and create vendor builds for the logged-in vendor
    """
    serializer_class = VendorBuildSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VendorBuild.objects.filter(vendor=self.request.user.vendor)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user.vendor)


class VendorBuildDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific build
    """
    serializer_class = VendorBuildSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VendorBuild.objects.filter(vendor=self.request.user.vendor)
