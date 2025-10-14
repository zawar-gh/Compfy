#builds/serializers.py
from rest_framework import serializers
from .models import Build, SavedBuild, Component
from vendors.serializers import VendorSerializer


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = ["id", "type", "name", "specs"]

class BuildSerializer(serializers.ModelSerializer):
    components = ComponentSerializer(many=True, read_only=True)

    class Meta:
        model = Build
        fields = [
            "id", "title", "description", "category", "intensity",
            "source", "vendor", "components", "price", "created_at"
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        components = {c["type"]: {"name": c["name"]} for c in data["components"]}

        return {
            "id": data["id"],
            "name": data["title"],
            "totalCost": data["price"],
            "category": {
                "id": data["category"],
                "name": instance.get_category_display()
            },
            "intensity": {
                "id": data["intensity"],
                "name": instance.get_intensity_display()
            },
            "isActive": True,
            "estimatedWattage": sum([50 for _ in data["components"]]),
            "components": components,
            "vendor": VendorSerializer(instance.vendor).data if instance.vendor else None  # ✅ Add this

        }



class SavedBuildSerializer(serializers.ModelSerializer):
    build = serializers.PrimaryKeyRelatedField(queryset=Build.objects.all())
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = SavedBuild
        fields = ['id', 'build', 'user', 'saved_at']
        read_only_fields = ['id', 'saved_at']

    def to_representation(self, instance):
        # Serialize base SavedBuild
        data = super().to_representation(instance)

        # Use BuildSerializer to include build details
        build_data = BuildSerializer(instance.build).data

        # Merge fields to match frontend format
        return {
            "id": data["id"],
            "saved_at": data["saved_at"],
            "build": build_data,  # full build details
        }

class PurchaseSerializer(serializers.ModelSerializer):
    build = BuildSerializer(read_only=True)