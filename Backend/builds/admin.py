from django.contrib import admin
from .models import PCBuild


@admin.register(PCBuild)
class PCBuildAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "intensity", "total_cost", "estimated_wattage", "compatibility")
    list_filter = ("category", "intensity", "compatibility")
    search_fields = ("name", "external_id")

# Register your models here.
