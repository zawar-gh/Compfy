# inventory/models.py
from django.db import models
from vendors.models import Vendor, VendorBuild

class InventoryItem(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="inventory_items")
    build = models.ForeignKey(VendorBuild, on_delete=models.CASCADE, related_name="inventory_items")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('vendor', 'build')  #No duplicates per vendor

    def __str__(self):
        return f"{self.build.title} ({self.vendor.shop_name})"
