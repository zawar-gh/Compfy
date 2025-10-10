import { API_BASE } from "./config";
import { PCBuild, SavedBuild } from "../types";

// Save a new build to user's saved builds
export async function saveBuild(build: PCBuild, token: string): Promise<SavedBuild> {
  const response = await fetch(`${API_BASE}/builds/saved-builds/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ build: build.id }), // Match backend field name
  });

  if (!response.ok) {
    throw new Error("Failed to save build");
  }

  return await response.json();
}

// Fetch all saved builds for the current user
export async function getSavedBuilds(token: string): Promise<SavedBuild[]> {
  const response = await fetch(`${API_BASE}/builds/saved-builds/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch saved builds");
  }

  const data = await response.json();

  // ✅ Normalize backend field names for frontend
  return data.map((item: any) => ({
    ...item,
    savedAt: item.saved_at, // convert snake_case → camelCase
  }));
}
