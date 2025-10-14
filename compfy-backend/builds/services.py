#builds/services.py
from django.db.models import Q
from .models import Build, Component
from decimal import Decimal

def detect_build_category(components):
    """Detect category from components"""
    cpu_specs = [c.specs.lower() for c in components if c.type == 'cpu' and c.specs]
    gpu_specs = [c.specs.lower() for c in components if c.type == 'gpu' and c.specs]

    # Professional / AI-ML detection
    if any('xeon' in spec or 'threadripper' in spec for spec in cpu_specs) or \
       any('quadro' in spec or 'rtx a' in spec or 'firepro' in spec for spec in gpu_specs):
        return "editing"
    
    # Office detection
    if not gpu_specs or all('integrated' in spec for spec in gpu_specs):
        return "office"
    
    # Gaming detection
    if any('geforce' in spec or 'amd radeon' in spec or 'intel arc' in spec for spec in gpu_specs):
        return "gaming"
    
    # Default fallback
    return "office"

def determine_intensity(category, price):
    """Determine intensity level based on category and price"""
    if category == "office":
        return "heavy" if price >= 50000 else "casual"
    else:  # editing / gaming
        return "heavy" if price >= 100000 else "casual"

def update_builds_categorization():
    """Automatically update vendor builds with proper category and intensity"""
    builds = Build.objects.filter(source="vendor").prefetch_related('components')
    
    for build in builds:
        components = build.components.all()
        category = detect_build_category(components)
        intensity = determine_intensity(category, build.price)
        
        build.category = category
        build.intensity = intensity
        build.save()

# builds/services.py

def get_recommended_builds(user):
    # Temporary stub to allow imports
    return []
