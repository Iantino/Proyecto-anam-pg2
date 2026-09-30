"use client";

// Datos del usuario con sesión activa, compartidos por todas las páginas
// del panel. Los carga una sola vez app/admin/layout.tsx y cualquier
// página puede leerlos con useSesion().
//
// Ojo: esto solo decide qué se MUESTRA. Los permisos reales se validan
// siempre en el backend.

import { createContext, useContext } from "react";

export type UsuarioSesion = {
  id: number;
  nombre: string;
  usuario: string;
  rol: string;
};

export const SesionContext = createContext<UsuarioSesion | null>(null);

export function useSesion() {
  return useContext(SesionContext);
}

export function esAdministrador(usuario: UsuarioSesion | null) {
  return usuario?.rol === "Administrador";
}
