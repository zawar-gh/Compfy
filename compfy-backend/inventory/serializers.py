# inventory/serializers.py
from rest_framework import serializers
from .models import InventoryItem

class InventoryItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='build.id')
    name = serializers.CharField(source='build.title')
    totalCost = serializers.DecimalField(source='build.price', max_digits=10, decimal_places=2)
    components = serializers.SerializerMethodField()

    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'totalCost', 'components']

    def get_components(self, obj):
        build = obj.build
        return {
            'cpu': str(build.cpu) if build.cpu else 'N/A',
            'gpu': str(build.gpu) if build.gpu else 'N/A',
            'ram': str(build.ram) if build.ram else 'N/A',
            'storage': str(build.storage) if build.storage else 'N/A',
            'psu': str(build.psu) if hasattr(build, 'psu') and build.psu else 'N/A',
            'case': str(build.case) if hasattr(build, 'case') and build.case else 'N/A',
        }

class InventoryItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id']
        read_only_fields = ['vendor']

    def update(self, instance, validated_data):
        build = instance.build
        request_data = self.context['request'].data
        
        if 'cpu' in request_data:
            build.cpu = request_data['cpu']
        if 'gpu' in request_data:
            build.gpu = request_data['gpu']
        if 'ram' in request_data:
            build.ram = request_data['ram']
        if 'storage' in request_data:
            build.storage = request_data['storage']
        if 'psu' in request_data:
            build.psu = request_data['psu']
        if 'case' in request_data:
            build.case = request_data['case']
        if 'price' in request_data:
            build.price = request_data['price']

        build.save()
        return instance