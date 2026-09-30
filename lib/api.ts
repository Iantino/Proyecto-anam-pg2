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
