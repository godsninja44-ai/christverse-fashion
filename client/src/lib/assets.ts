/**
 * Resolve an API-served asset path (e.g. "/api/static/christverse/x.png")
 * against the API origin when the client is hosted separately from the API.
 *
 * In the monorepo (same-origin proxy) VITE_API_URL is unset, so this is a
 * pass-through. In the standalone export, VITE_API_URL is the API origin and
 * relative asset paths must be prefixed or the static host serves index.html.
 */
const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/+$/,
  "",
);

export function assetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (apiUrl && path.startsWith("/")) return `${apiUrl}${path}`;
  return path;
}
