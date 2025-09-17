from rest_framework import serializers

from .models import PCBuild


class PCBuildSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = PCBuild
        fields = [
            "id",
            "external_id",
            "name",
            "category",
            "intensity",
            "total_cost",
            "estimated_wattage",
            "compatibility",
            "image_url",
            "components",
            "upgrades_suggestions",
            "created_at",
            "updated_at",
        ]


class PCBuildBulkUpdateSerializer(serializers.Serializer):
    builds = PCBuildSerializer(many=True)

