from typing import Any, Dict

from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from .models import PCBuild
from .serializers import PCBuildSerializer


class PCBuildViewSet(viewsets.ModelViewSet):
    queryset = PCBuild.objects.all()
    serializer_class = PCBuildSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        intensity = self.request.query_params.get("intensity")
        if category:
            qs = qs.filter(category=category)
        if intensity:
            qs = qs.filter(intensity=intensity)
        return qs

    @action(detail=False, methods=["post"])  # POST /api/builds/seed/
    def seed(self, request: Request) -> Response:
        payload = request.data
        # Accept either a list directly or an object { builds: [...] }
        if isinstance(payload, dict) and "builds" in payload:
            payload = payload["builds"]
        if not isinstance(payload, list):
            return Response({"detail": "Expected a list of builds or {builds: [...]}"}, status=status.HTTP_400_BAD_REQUEST)

        created, updated = 0, 0
        with transaction.atomic():
            for build in payload:
                # Map frontend keys to backend fields
                # Support both camelCase (frontend) and snake_case (backend) keys
                def any_key(d: Dict[str, Any], *keys: str):
                    for k in keys:
                        if k in d:
                            return d[k]
                    return None

                defaults: Dict[str, Any] = {
                    "name": any_key(build, "name"),
                    "category": any_key(build, "category"),
                    "intensity": any_key(build, "intensity"),
                    "total_cost": any_key(build, "totalCost", "total_cost"),
                    "estimated_wattage": any_key(build, "estimatedWattage", "estimated_wattage"),
                    "compatibility": any_key(build, "compatibility"),
                    "image_url": any_key(build, "imageUrl", "image_url"),
                    "components": any_key(build, "components") or {},
                    "upgrades_suggestions": any_key(build, "upgradesSuggestions", "upgrades_suggestions") or [],
                }
                ext_id = any_key(build, "external_id", "id")
                if not ext_id:
                    return Response({"detail": "Each build requires external_id or id"}, status=status.HTTP_400_BAD_REQUEST)
                obj, is_created = PCBuild.objects.update_or_create(
                    external_id=ext_id, defaults=defaults
                )
                if is_created:
                    created += 1
                else:
                    updated += 1

        return Response({"created": created, "updated": updated})

    @action(detail=False, methods=["put"])  # PUT /api/builds/bulk_update/
    def bulk_update(self, request: Request) -> Response:
        payload = request.data
        # Accept either { builds: [...] } or a direct list
        builds_data = payload.get("builds") if isinstance(payload, dict) else payload
        if not isinstance(builds_data, list):
            return Response({"detail": "Expected builds as a list or {builds: [...]}"}, status=status.HTTP_400_BAD_REQUEST)
        updated = 0
        with transaction.atomic():
            for b in builds_data:
                # Allow update by id or external_id
                build_obj = None
                pk = b.get("id")
                external_id = b.get("external_id") or b.get("id")
                if pk:
                    build_obj = PCBuild.objects.filter(pk=pk).first()
                if build_obj is None and external_id:
                    build_obj = PCBuild.objects.filter(external_id=external_id).first()
                if build_obj is None:
                    continue

                # Accept both snake_case and camelCase keys
                def apply(d: Dict[str, Any], obj: PCBuild, key: str, *alts: str):
                    if key in d:
                        setattr(obj, key, d[key])
                        return
                    for a in alts:
                        if a in d:
                            setattr(obj, key, d[a])
                            return

                apply(b, build_obj, "name")
                apply(b, build_obj, "category")
                apply(b, build_obj, "intensity")
                apply(b, build_obj, "total_cost", "totalCost")
                apply(b, build_obj, "estimated_wattage", "estimatedWattage")
                apply(b, build_obj, "compatibility")
                apply(b, build_obj, "image_url", "imageUrl")
                apply(b, build_obj, "components")
                apply(b, build_obj, "upgrades_suggestions", "upgradesSuggestions")
                build_obj.save()
                updated += 1

        return Response({"updated": updated})

# Create your views here.
