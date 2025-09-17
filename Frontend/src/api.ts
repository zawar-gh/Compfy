import { PCBuild } from './types';

const API_BASE = 'http://localhost:8000/api';

// Transform backend -> frontend shape
function toFrontendBuild(b: any): PCBuild {
  return {
    id: b.external_id ?? String(b.id),
    name: b.name,
    category: b.category,
    intensity: b.intensity,
    totalCost: b.total_cost,
    estimatedWattage: b.estimated_wattage,
    compatibility: b.compatibility,
    imageUrl: b.image_url || undefined,
    components: b.components,
    upgradesSuggestions: b.upgrades_suggestions || [],
  };
}

// Transform frontend -> backend shape
function toBackendBuild(b: PCBuild) {
  return {
    external_id: b.id,
    name: b.name,
    category: b.category,
    intensity: b.intensity,
    total_cost: b.totalCost,
    estimated_wattage: b.estimatedWattage,
    compatibility: b.compatibility,
    image_url: b.imageUrl ?? null,
    components: b.components,
    upgrades_suggestions: b.upgradesSuggestions,
  };
}

export async function fetchBuilds(category?: string, intensity?: string): Promise<PCBuild[]> {
  const url = new URL(`${API_BASE}/builds/`);
  if (category) url.searchParams.set('category', category);
  if (intensity) url.searchParams.set('intensity', intensity);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch builds');
  const data = await res.json();
  return data.map(toFrontendBuild);
}

export async function seedBuilds(builds: PCBuild[]): Promise<{ created: number; updated: number; }> {
  const res = await fetch(`${API_BASE}/builds/seed/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(builds.map(toBackendBuild)),
  });
  if (!res.ok) throw new Error('Failed to seed builds');
  return res.json();
}

export async function bulkUpdateBuilds(builds: PCBuild[]): Promise<{ updated: number; }> {
  const res = await fetch(`${API_BASE}/builds/bulk_update/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ builds: builds.map(toBackendBuild) }),
  });
  if (!res.ok) throw new Error('Failed to update builds');
  return res.json();
}

export function mapBackendToFrontend(b: any): PCBuild { return toFrontendBuild(b); }
export function mapFrontendToBackend(b: PCBuild): any { return toBackendBuild(b); }


