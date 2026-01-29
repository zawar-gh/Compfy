// src/api/builds.ts
import { PCBuild } from "../types";

const API_BASE = import.meta.env.VITE_API_URL;

export async function getBuilds(): Promise<PCBuild[]> {
  const response = await fetch(`${API_BASE}builds/`);
  if (!response.ok) {
    throw new Error("Failed to fetch builds");
  }

  const data = await response.json();

  return data.map((build: any) => ({
    id: build.id,
    name: build.name || "N/A",
    totalCost: Number(build.totalCost) || 0,
    estimatedWattage: build.estimatedWattage || 0,
    components: {
      cpu: { name: build.components?.cpu?.name || "N/A" },
      gpu: { name: build.components?.gpu?.name || "N/A" },
      ram: { name: build.components?.ram?.name || "N/A" },
      storage: { name: build.components?.storage?.name || "N/A" },
      motherboard: { name: build.components?.motherboard?.name || "N/A" },
      psu: { name: build.components?.psu?.name || "N/A" },
    },
    category: build.category || "gaming",
    intensity: build.intensity || "casual",
    isActive: build.isActive ?? true,
    vendor: build.vendor || null,
  }));
}

export async function getBuildDetail(id: number): Promise<PCBuild> {
  const response = await fetch(`${API_BASE}builds/${id}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch build detail");
  }

  const build = await response.json();

  return {
    id: build.id,
    name: build.name,
    totalCost: Number(build.totalCost),
    estimatedWattage: build.estimatedWattage || 0,
    components: build.components || {},
    category:
      typeof build.category === "string"
        ? build.category
        : build.category?.id || "gaming",
    intensity:
      typeof build.intensity === "string"
        ? build.intensity
        : build.intensity?.id || "casual",
    isActive: build.isActive ?? true,
    vendor: build.vendor || null,
  };
}
