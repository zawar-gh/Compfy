from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BuildListView, BuildDetailView, SavedBuildView, SavedBuildsListView, PurchaseBuildView, refresh_build_categories

router = DefaultRouter()
router.register(r"saved-builds", SavedBuildView, basename="saved-builds")

urlpatterns = [
    # Build browsing
    path("", BuildListView.as_view(), name="build-list"),
    path("<int:pk>/", BuildDetailView.as_view(), name="build-detail"),

    # Saved builds list (custom, only list for user)
    path("saved/", SavedBuildsListView.as_view(), name="saved-builds-list"),

    # Purchase builds
    path("purchase/", PurchaseBuildView.as_view(), name="purchase-build"),

    # Include router for SavedBuildView (handles create, list, retrieve, update, delete)
    path("", include(router.urls)),

    # Refresh build categories
    path('refresh-categories/', refresh_build_categories, name='refresh-categories'),
]
