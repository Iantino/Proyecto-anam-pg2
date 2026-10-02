// Helper central para llamar al backend (Express) desde el frontend.
// credentials: "include" es obligatorio para que la cookie de sesión
// viaje entre localhost:3000 (frontend) y localhost:4000 (backend).

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Ocurrió un error inesperado.");
  }

  return data;
}

// Para subir archivos (multipart/form-data). No se debe fijar el header
// Content-Type a mano: el navegador arma el boundary correcto solo si se
// lo dejamos hacer a él.
export async function apiUpload(path: string, formData: FormData) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "No se pudo subir el archivo.");
  }

  return data;
}

// Obtiene un archivo protegido usando la sesión del panel.
//
// No se usan enlaces directos (<a href="https://api.../descargar">) porque
// cuando el frontend y la API están en dominios distintos (p. ej. vercel.app
// y railway.app) el navegador abre esa dirección SIN la cookie de sesión y la
// API responde "No autenticado". Con fetch + credentials la cookie sí viaja.
export async function apiBlob(path: string): Promise<{ blob: Blob; nombre: string | null }> {
  const res = await fetch(`${API_URL}${path}`, { credentials: "include" });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo obtener el archivo.");
  }

  // Nombre enviado por la API (requiere que exponga Content-Disposition).
  const disposicion = res.headers.get("Content-Disposition") || "";
  const utf8 = disposicion.match(/filename\*=UTF-8''([^;]+)/i);
  const simple = disposicion.match(/filename="?([^";]+)"?/i);
  const nombre = utf8 ? decodeURIComponent(utf8[1]) : simple ? simple[1] : null;

  return { blob: await res.blob(), nombre };
}

// Descarga un archivo protegido y lo guarda con el nombre indicado
// (o con el que envía la API si no se indica uno).
export async function apiDownload(path: string, nombreSugerido?: string) {
  const { blob, nombre } = await apiBlob(path);

  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreSugerido || nombre || "archivo";
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  // Se libera después para no cortar la descarga en navegadores lentos.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
