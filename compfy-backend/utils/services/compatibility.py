def check_compatibility(cpu, gpu):
    if "Intel" in cpu and "NVIDIA" in gpu:
        return {"compatible": True, "message": "CPU and GPU are compatible."}
    return {"compatible": False, "message": "Potential compatibility issue detected."}
