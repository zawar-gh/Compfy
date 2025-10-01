// src/api/builds.ts
import { PCBuild } from "../types";

const API_BASE = "http://127.0.0.1:8000/api"; // adjust when deploying

export async function getBuilds(): Promise<PCBuild[]> {
  const response = await fetch(`${API_BASE}/builds/`);
  if (!response.ok) {
    throw new Error("Failed to fetch builds");
  }
  const data = await response.json();

  // 🔥 Normalize backend response so UI doesn't crash
  return data.map((build: any) => ({
    id: build.id,
    name: build.name,
    totalCost: Number(build.totalCost), // backend gives string → convert to number
    estimatedWattage: build.estimatedWattage || 0,
    components: build.components || {},

    // fallback values (since backend doesn’t send them)
    category: build.category || "gaming",     // default to gaming
    intensity: build.intensity || "casual",  // default to casual
    isActive: build.isActive ?? true
  }));
}

export async function getBuildDetail(id: number): Promise<PCBuild> {
  const response = await fetch(`${API_BASE}/builds/${id}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch build detail");
  }
  const build = await response.json();

  // same normalization
  return {
    id: build.id,
    name: build.name,
    totalCost: Number(build.totalCost),
    estimatedWattage: build.estimatedWattage || 0,
    components: build.components || {},
    category: build.category || "gaming",
    intensity: build.intensity || "casual",
    isActive: build.isActive ?? true
  };
}
