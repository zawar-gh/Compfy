def get_market_price(component):
    prices = {
        "GPU": "Rs. 80,000",
        "CPU": "Rs. 50,000",
        "RAM": "Rs. 15,000",
        "SSD": "Rs. 12,000"
    }
    return {"component": component, "price": prices.get(component.upper(), "Unknown")}
