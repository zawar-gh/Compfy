#builds/management/commands/sync_vendor_builds.py
from django.core.management.base import BaseCommand
from builds.utils import sync_vendor_builds

class Command(BaseCommand):
    help = "Sync all VendorBuilds into Build table"

    def handle(self, *args, **options):
        sync_vendor_builds()
        self.stdout.write(self.style.SUCCESS("✅ Vendor builds synced successfully!"))
