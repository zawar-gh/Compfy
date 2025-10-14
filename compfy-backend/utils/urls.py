#utils/urls.py
from django.urls import path
from .views import CompatibilityCheckView, BudgetOptimizationView, MarketPriceView, PowerConsumptionView

urlpatterns = [
    path("compatibility-check/", CompatibilityCheckView.as_view(), name="compatibility-check"),
    path("budget-optimization/", BudgetOptimizationView.as_view(), name="budget-optimization"),
    path("market-prices/", MarketPriceView.as_view(), name="market-prices"),
    path("power-consumption/", PowerConsumptionView.as_view(), name="power-consumption"),
]
