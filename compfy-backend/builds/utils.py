# builds/utils.py
from builds.models import Build, Component
from inventory.models import VendorBuild
from decimal import Decimal

def sync_vendor_builds():
    """
    Sync VendorBuilds to Build table using vendor_build_id as source of truth.
    Prevents duplicates and handles updates/deletes properly.
    """
    from decimal import Decimal
    
    synced_vendor_build_ids = []
    
    for vb in VendorBuild.objects.all():
        synced_vendor_build_ids.append(vb.id)
        
        # ✅ Find or create Build using vendor_build_id (not title!)
        build, created = Build.objects.get_or_create(
            source="vendor",
            vendor_build_id=vb.id,  # ✅ USE ID, NOT TITLE
            defaults={
                "title": vb.title,
                "vendor": vb.vendor,
                "price": Decimal(str(vb.price)),
                "description": getattr(vb, 'description', ''),
            }
        )
        
        # Update existing build if needed
        if not created:
            updated = False
            
            if build.title != vb.title:
                build.title = vb.title
                updated = True
            
            new_price = Decimal(str(vb.price))
            if build.price != new_price:
                build.price = new_price
                updated = True
            
            if build.vendor != vb.vendor:
                build.vendor = vb.vendor
                updated = True
            
            new_desc = getattr(vb, 'description', '')
            if build.description != new_desc:
                build.description = new_desc
                updated = True
            
            if updated:
                build.save()
                print(f"📝 Updated: {build.title}")
        else:
            print(f"✨ Created: {build.title}")
        
        # Sync components
        build.components.clear()
        
        component_map = {
            "cpu": vb.cpu,
            "gpu": vb.gpu,
            "ram": vb.ram,
            "storage": vb.storage,
            "psu": vb.psu,
            "case":  vb.case,
        }
        
        for comp_type, comp_name in component_map.items():
            if comp_name:
                component, _ = Component.objects.get_or_create(
                    type=comp_type,
                    name=comp_name,
                    specs=comp_name
                )
                build.components.add(component)
        
        # Auto-categorize
        categorize_build(build)
        build.save()
    
    # 🗑️ DELETE orphaned builds (VendorBuilds that were deleted)
    orphaned_builds = Build.objects.filter(
        source="vendor"
    ).exclude(
        vendor_build_id__in=synced_vendor_build_ids
    )
    
    deleted_count = orphaned_builds.count()
    if deleted_count > 0:
        print(f"🗑️ Deleting {deleted_count} orphaned builds")
        orphaned_builds.delete()
    
    print(f"✅ Sync complete: {len(synced_vendor_build_ids)} vendor builds")


def categorize_build(build):
    """Auto-categorize build based on components"""
    cpu_specs = [c.specs.lower() for c in build.components.filter(type='cpu') if c.specs]
    gpu_specs = [c.specs.lower() for c in build.components.filter(type='gpu') if c.specs]
    
    # Detect category
    if any('xeon' in s or 'threadripper' in s for s in cpu_specs) or \
       any('quadro' in s or 'firepro' in s for s in gpu_specs):
        category = "editing"
    elif not gpu_specs or all('integrated' in s for s in gpu_specs):
        category = "office"
    elif any('geforce' in s or 'gtx' in s or 'rtx' in s or 'radeon' in s for s in gpu_specs):
        category = "gaming"
    else:
        category = "office"
    
    # Detect intensity
    intensity = "heavy" if (
        (category == "office" and build.price >= 50000) or
        (category in ["editing", "gaming"] and build.price >= 100000)
    ) else "casual"
    
    build.category = category
    build.intensity = intensity