# builds/models.py
from django.db import models
from django.contrib.auth.models import User
from vendors.models import Vendor
from django.conf import settings

class SavedBuild(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_builds"
    )
    build = models.ForeignKey(
        "Build",
        on_delete=models.CASCADE,
        related_name="saved_by_users"
    )
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "build")  # prevent duplicates

    def __str__(self):
        return f"{self.user.username} saved {self.build.title}"


class Component(models.Model):
    TYPE_CHOICES = (
        ("cpu", "CPU"),
        ("gpu", "GPU"),
        ("ram", "RAM"),
        ("storage", "Storage"),
        ("psu", "Power Supply"),
        ("motherboard", "Motherboard"),
        ("case", "Case"),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=150)
    specs = models.CharField(max_length=255, blank=True, null=True)  # Changed from TextField to CharField

    class Meta:
        # MySQL cannot use TextField in unique_together
        unique_together = ('type', 'name', 'specs')
        # If specs can be very long, use this instead:
        # unique_together = ('type', 'name')

    def __str__(self):
        return f"{self.type.upper()} - {self.name}"


class Build(models.Model):
    SOURCE_CHOICES = (
        ("system", "System Generated"),
        ("vendor", "Vendor Provided"),
    )

    CATEGORY_CHOICES = [
        ("office", "Office / Study"),
        ("editing", "Editing / AI-ML"),
        ("gaming", "Gaming & Streaming"),
    ]

    INTENSITY_CHOICES = [
        ("casual", "Casual"),
        ("heavy", "Heavy"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="office")
    intensity = models.CharField(max_length=20, choices=INTENSITY_CHOICES, default="casual")
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="system")
    vendor = models.ForeignKey(
        Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name="provided_builds"
    )
    vendor_build_id = models.IntegerField(
        null=True, blank=True, db_index=True, help_text="Links to VendorBuild.id for sync tracking"
    )
    components = models.ManyToManyField(Component, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.category} - {self.intensity})"


class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="purchases")
    build = models.ForeignKey(Build, on_delete=models.CASCADE, related_name="purchases")
    purchased_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="pending")  # e.g., pending, completed

    def __str__(self):
        return f"{self.user.username} purchased {self.build.title}"
