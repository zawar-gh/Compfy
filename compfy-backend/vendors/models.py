#vendors/models.py
from django.db import models
from django.contrib.auth.models import User

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vendor")
    shop_name = models.CharField(max_length=150)
    city = models.CharField(max_length=100)
    contact = models.CharField(max_length=50)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.shop_name} ({self.city})"


class VendorBuild(models.Model):
    CATEGORY_CHOICES = [
        ('gaming', 'Gaming'),
        ('office', 'Office'),
        ('workstation', 'Workstation'),
    ]
    
    INTENSITY_CHOICES = [
        ('casual', 'Casual'),
        ('moderate', 'Moderate'),
        ('intensive', 'Intensive'),
    ]

    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="builds")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    cpu = models.CharField(max_length=100)
    gpu = models.CharField(max_length=100, blank=True, null=True)
    ram = models.CharField(max_length=100)
    storage = models.CharField(max_length=100)
    psu = models.CharField(max_length=100)
    case = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='gaming')
    intensity = models.CharField(max_length=20, choices=INTENSITY_CHOICES, default='casual')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.vendor.shop_name}"
