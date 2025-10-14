#testinventory.py
import os
import sys
import django

# Add project root to Python path
sys.path.append(r"D:\Coding\Compfy\compfy-backend")

# Set Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "compfy.settings")

# Setup Django
django.setup()

from builds.models import PCBuild, Vendor

# Your test code here...


from builds.models import PCBuild, Vendor
from builds.services import get_recommended_builds

vendor_id = 1  # your vendor ID
vendor = Vendor.objects.get(id=vendor_id)

inventory_builds = PCBuild.objects.filter(vendor=vendor)
print("Inventory Builds:", [b.title for b in inventory_builds])

recommended_builds = get_recommended_builds(vendor_id)
print("Recommended Builds:", [b['title'] for b in recommended_builds])

# Delete first build (test)
if inventory_builds:
    first_build = inventory_builds[0]
    print(f"Deleting build: {first_build.title}")
    first_build.delete()

# Check updated lists
updated_inventory = PCBuild.objects.filter(vendor=vendor)
updated_recommended = get_recommended_builds(vendor_id)
print("Updated Inventory:", [b.title for b in updated_inventory])
print("Updated Recommended:", [b['title'] for b in updated_recommended])
