/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // our API base URL
  // add other VITE_ env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
