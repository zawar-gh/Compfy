# inventory/urls.py
from django.urls import path
from . import views
from .views import VendorInventoryView, InventoryItemUpdateView, InventoryUploadView, BulkUpdateInventoryView

urlpatterns = [
    # Fetch inventory for a vendor
    path('<int:vendor_id>/', VendorInventoryView.as_view(), name='vendor-inventory'),

    # Update a single inventory item
    path('update/<int:item_id>/', InventoryItemUpdateView.as_view(), name='update-inventory-item'),

    # Upload inventory via CSV/Excel
    path('<int:vendor_id>/upload/', InventoryUploadView.as_view(), name='upload-inventory'),
    path('<int:vendor_id>/bulk-update/', BulkUpdateInventoryView.as_view()),
    path('vendor/<int:vendor_id>/build/<int:build_id>/delete/', views.delete_vendor_build, name='delete_vendor_build'),


]
