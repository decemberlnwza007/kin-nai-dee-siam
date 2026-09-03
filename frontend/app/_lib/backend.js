const BACKEND_URL = (
  process.env.BACKEND_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

export async function fetchBackend(path, options = {}) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };

  return { data, status: response.status };
}
