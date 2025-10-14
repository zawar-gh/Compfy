#vendors serializers.py
from rest_framework import serializers
from .models import Vendor, VendorBuild

class VendorSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Vendor
        fields = ["id", "shop_name", "city", "contact", "address", "user"]


class VendorBuildSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorBuild
        fields = ["id", "title", "description", "cpu", "gpu", "ram", "storage","psu", "case", "price", "created_at"]
