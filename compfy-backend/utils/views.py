#util/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .services.compatibility import check_compatibility
from .services.budget import optimize_budget
from .services.prices import get_market_price
from .services.power import estimate_power

class CompatibilityCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cpu = request.query_params.get("cpu")
        gpu = request.query_params.get("gpu")
        if not cpu or not gpu:
            return Response({"error": "cpu and gpu are required"}, status=400)
        result = check_compatibility(cpu, gpu)
        return Response(result)


class BudgetOptimizationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        budget = request.data.get("budget")
        if not budget:
            return Response({"error": "budget is required"}, status=400)
        result = optimize_budget(budget)
        return Response(result)


class MarketPriceView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        component = request.query_params.get("component")
        if not component:
            return Response({"error": "component is required"}, status=400)
        result = get_market_price(component)
        return Response(result)


class PowerConsumptionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        build_id = request.query_params.get("build_id")
        if not build_id:
            return Response({"error": "build_id is required"}, status=400)
        result = estimate_power(build_id)
        return Response(result)
