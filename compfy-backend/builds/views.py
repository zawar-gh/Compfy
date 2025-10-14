# Builds/views.py
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Build, SavedBuild, Purchase
from .serializers import BuildSerializer, SavedBuildSerializer, PurchaseSerializer
from .services import get_recommended_builds, update_builds_categorization


# -------------------- Browse Builds --------------------
class BuildListView(generics.ListAPIView):
    queryset = Build.objects.all().order_by("-created_at")
    serializer_class = BuildSerializer
    permission_classes = [permissions.AllowAny]


class BuildDetailView(generics.RetrieveAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer
    permission_classes = [permissions.AllowAny]


# -------------------- Save Builds --------------------
class SavedBuildView(viewsets.ModelViewSet):
    serializer_class = SavedBuildSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedBuild.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        print("🧩 Incoming data:", request.data)
        build_id = request.data.get("build")
        user = request.user

        # ✅ Check if already saved
        existing = SavedBuild.objects.filter(user=user, build_id=build_id).first()
        if existing:
            print("⚠️ Build already saved for this user.")
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=200)

        # ✅ Otherwise, create new
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)

        self.perform_create(serializer)
        print("✅ SavedBuild created successfully:", serializer.data)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


class SavedBuildsListView(generics.ListAPIView):
    serializer_class = SavedBuildSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedBuild.objects.filter(user=self.request.user)


# -------------------- Purchase Builds --------------------
class PurchaseBuildView(generics.CreateAPIView):
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        build_id = self.request.data.get("build_id")
        build = Build.objects.get(id=build_id)
        serializer.save(user=self.request.user, build=build)


# -------------------- Admin / Utility --------------------
def get_builds_view(request):
    user_preferences = {
        'category': request.GET.get('category'),
        'intensity': request.GET.get('intensity'),
        'max_price': request.GET.get('max_price')
    }
    user_preferences = {k: v for k, v in user_preferences.items() if v is not None}
    builds = get_recommended_builds(user_preferences)
    # TODO: serialize & return builds if needed


@api_view(['POST'])
def refresh_build_categories(request):
    """Admin endpoint to refresh build categories"""
    update_builds_categorization()
    return Response({"status": "success"})
