from django.db import models


class PCBuild(models.Model):
    CATEGORY_CHOICES = [
        ("office", "Office"),
        ("editing", "Editing/AI-ML"),
        ("gaming", "Gaming"),
    ]

    INTENSITY_CHOICES = [
        ("casual", "Casual"),
        ("heavy", "Heavy"),
    ]

    COMPATIBILITY_CHOICES = [
        ("optimized", "Optimized"),
        ("warning", "Warning"),
    ]

    external_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    intensity = models.CharField(max_length=20, choices=INTENSITY_CHOICES)
    total_cost = models.PositiveIntegerField()
    estimated_wattage = models.PositiveIntegerField()
    compatibility = models.CharField(max_length=20, choices=COMPATIBILITY_CHOICES)
    image_url = models.URLField(blank=True, null=True)

    # Components and upgrade suggestions as JSON blobs to match frontend structure
    components = models.JSONField()
    upgrades_suggestions = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "intensity", "total_cost", "name"]

    def __str__(self) -> str:  # noqa: D401
        return f"{self.name} ({self.category}-{self.intensity})"

# Create your models here.
