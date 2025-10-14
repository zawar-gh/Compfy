def check_compatibility(cpu, gpu):
    # Dummy check (replace with real logic later)
    if "Intel" in cpu and "NVIDIA" in gpu:
        return {"compatible": True, "message": "CPU and GPU are compatible."}
    return {"compatible": False, "message": "Potential compatibility issue detected."}
