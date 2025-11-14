# inventory/views.py
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from django.shortcuts import get_object_or_404
import csv, io
from vendors.models import VendorBuild, Vendor
from .models import InventoryItem
from .serializers import InventoryItemSerializer, InventoryItemUpdateSerializer
from builds.utils import sync_vendor_builds
import logging

logger = logging.getLogger(__name__)

# -------------------- Fetch inventory for a vendor --------------------
class VendorInventoryView(APIView):
    def get(self, request, vendor_id):
        vendor = get_object_or_404(Vendor, id=vendor_id)
        inventory = InventoryItem.objects.filter(vendor=vendor)
        
        # Debug logging
        logger.debug(f"Found {inventory.count()} items for vendor {vendor_id}")
        for item in inventory:
            logger.debug(f"""
                Build ID: {item.build.id}
                Title: {item.build.title}
                CPU: {item.build.cpu}
                GPU: {item.build.gpu}
                RAM: {item.build.ram}
                Storage: {item.build.storage}
                Price: {item.build.price}
                PSU: {item.build.psu}
            """)
        
        serializer = InventoryItemSerializer(inventory, many=True)
        logger.debug(f"Serialized data: {serializer.data}")
        
        return Response(serializer.data, status=status.HTTP_200_OK)

# -------------------- Update a single inventory item --------------------
class InventoryItemUpdateView(APIView):
    def put(self, request, item_id):
        item = get_object_or_404(InventoryItem, id=item_id)
        serializer = InventoryItemUpdateSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------- Upload inventory via Excel/CSV --------------------
class InventoryUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, vendor_id):
        vendor = get_object_or_404(Vendor, id=vendor_id)
        file_obj = request.FILES.get('file')

        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        if not (file_obj.name.endswith('.csv') or file_obj.name.endswith('.xlsx')):
            return Response({'error': 'Invalid file format. Only XLSX or CSV allowed.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # For now, handle CSV only (XLSX can be added later)
        if file_obj.name.endswith('.csv'):
            decoded_file = file_obj.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)

            rows_processed = 0
            rows_created = 0
            rows_updated = 0
            rows_invalid = 0
            errors = []

            for row in reader:
                rows_processed += 1
                title = row.get('build_name')
                cpu = row.get('cpu_model')
                gpu = row.get('gpu_model', '')
                ram = row.get('ram')
                psu = row.get('psu')  # ✅ new
                case = row.get('case')  # ✅ new
                storage = row.get('storage')
                price = row.get('price')

                if not (title and cpu and ram and storage and price):
                    rows_invalid += 1
                    errors.append(f"Row {rows_processed} missing required fields")
                    continue

                try:
                    price_val = float(price)
                except ValueError:
                    rows_invalid += 1
                    errors.append(f"Row {rows_processed} has invalid price")
                    continue

                # Check if build already exists for this vendor
                build_qs = VendorBuild.objects.filter(vendor=vendor, title=title)
                if build_qs.exists():
                    build = build_qs.first()
                    build.cpu = cpu
                    build.gpu = gpu
                    build.ram = ram
                    build.storage = storage
                    build.psu = psu  # ✅ added
                    build.case = case  # ✅ added
                    build.price = price_val
                    build.save()
                    rows_updated += 1
                else:
                    build = VendorBuild.objects.create(
                        vendor=vendor,
                        title=title,
                        cpu=cpu,
                        gpu=gpu,
                        ram=ram,
                        storage=storage,
                        psu=psu,  # ✅ added
                        case=case,  # ✅ added
                        price=price_val
                    )
                    rows_created += 1

                # Add to InventoryItem table so it's visible to all users
                InventoryItem.objects.get_or_create(vendor=vendor, build=build)
            sync_vendor_builds()
            return Response({
                "rowsProcessed": rows_processed,
                "rowsCreated": rows_created,
                "rowsUpdated": rows_updated,
                "rowsInvalid": rows_invalid,
                "errors": errors
            }, status=status.HTTP_200_OK)
# -------------------- Bulk update or create vendor builds --------------------
class BulkUpdateInventoryView(APIView):
    def put(self, request, vendor_id):
        vendor = get_object_or_404(Vendor, id=vendor_id)
        builds = request.data  # list of dicts

        if not isinstance(builds, list):
            return Response({"error": "Expected a list of builds"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Handle empty inventory (after deleting all)
        if len(builds) == 0:
            sync_vendor_builds()
            return Response({"message": "No builds to update", "created": 0, "updated": 0}, status=status.HTTP_200_OK)

        created = 0
        updated = 0
        errors = []

        for build_data in builds:
            build_id = build_data.get('id')
            title = build_data.get('title')
            price = build_data.get('price', 0)
            cpu = build_data.get('cpu')
            gpu = build_data.get('gpu')
            ram = build_data.get('ram')
            storage = build_data.get('storage')
            psu = build_data.get('psu')
            try:
                # ✅ CASE 1: New build (temp-ID)
                if isinstance(build_id, str) and build_id.startswith("temp-"):
                    # Try to find an existing build with the same title for this vendor
                    existing = VendorBuild.objects.filter(vendor=vendor, title=title).first()
                    if existing:
                        # Update existing instead of creating duplicate
                        existing.cpu = cpu
                        existing.gpu = gpu
                        existing.ram = ram
                        existing.storage = storage
                        existing.psu = psu
                        existing.price = price
                        existing.save()
                        InventoryItem.objects.get_or_create(vendor=vendor, build=existing)
                        updated += 1
                    else:
                        build = VendorBuild.objects.create(
                            vendor=vendor,
                            title=title,
                            price=price,
                            cpu=cpu,
                            gpu=gpu,
                            ram=ram,
                            storage=storage,
                            psu=psu,
                        )
                        InventoryItem.objects.get_or_create(vendor=vendor, build=build)
                        created += 1
                    continue

                # ✅ CASE 2: Existing build update
                build = VendorBuild.objects.get(id=build_id, vendor=vendor)
                for field in ['title', 'price', 'cpu', 'gpu', 'ram', 'storage','psu']:
                    if field in build_data:
                        setattr(build, field, build_data[field])
                build.save()

                InventoryItem.objects.get_or_create(vendor=vendor, build=build)
                updated += 1

            except VendorBuild.DoesNotExist:
                errors.append(f"Build with id {build_id} not found")
            except Exception as e:
                errors.append(f"Error processing build {build_id or title}: {str(e)}")

        # ✅ Sync after all operations
        try:
            sync_vendor_builds()
        except Exception as e:
            errors.append(f"Sync error: {str(e)}")

        return Response({
            "created": created,
            "updated": updated,
            "errors": errors
        }, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_vendor_build(request, vendor_id, build_id):
    from builds.utils import sync_vendor_builds

    try:
        # Get the build
        build = VendorBuild.objects.get(vendor__id=vendor_id, id=build_id)

        # Delete any related InventoryItem entries
        InventoryItem.objects.filter(vendor__id=vendor_id, build=build).delete()

        # Delete the VendorBuild itself
        build.delete()

        # Sync after deletion
        sync_vendor_builds()

        return Response({"message": "Build deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    except VendorBuild.DoesNotExist:
        return Response({"error": "Build not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
