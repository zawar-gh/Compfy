// src/api/savedBuilds.ts
import { API_BASE } from "./config";
import { PCBuild, SavedBuild } from "../types";

export async function saveBuild(build: PCBuild, token: string): Promise<SavedBuild> {
  const response = await fetch(`${API_BASE}/builds/saved-builds/`, {  // <-- add 'builds/' prefix
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ build: build.id }),  // <-- match backend expected field
  });

  if (!response.ok) {
    throw new Error("Failed to save build");
  }
  return await response.json();
}

export async function getSavedBuilds(token: string): Promise<SavedBuild[]> {
  const response = await fetch(`${API_BASE}/builds/saved-builds/`, {  // <-- add 'builds/' prefix
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch saved builds");
  }
  return await response.json();
}
