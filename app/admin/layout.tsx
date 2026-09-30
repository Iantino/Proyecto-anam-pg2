"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { SesionContext, esAdministrador, type UsuarioSesion } from "@/lib/sesion";

// soloAdmin: el Operativo no ve la pestaña ni puede entrar a la ruta.
const NAV = [
  { href: "/admin", label: "Mensajes" },
  { href: "/admin/tramites", label: "Trámites" },
  { href: "/admin/usuarios", label: "Usuarios", soloAdmin: true },
  { href: "/admin/reportes", label: "Reportes", soloAdmin: true },
  { href: "/admin/institucion", label: "Institución", soloAdmin: true },
  { href: "/admin/alcalde", label: "Alcalde", soloAdmin: true },
  { href: "/admin/informacion-publica", label: "Información pública" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  const esLogin = pathname === "/admin/login";

  useEffect(() => {
    if (esLogin) {
      setCargando(false);
      return;
    }
    async function verificar() {
      try {
        const sesion = await apiFetch("/api/sesion");
        setUsuario(sesion.usuario);
      } catch {
        router.push("/admin/login");
      } finally {
        setCargando(false);
      }
    }
    verificar();
  }, [esLogin, router]);

  async function handleLogout() {
    await apiFetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
  }

  // La pantalla de login maneja su propio diseño (pantalla completa oscura).
  if (esLogin) return <>{children}</>;

  const admin = esAdministrador(usuario);
  const navVisible = NAV.filter((item) => admin || !item.soloAdmin).map((item) =>
    // Para el Operativo la pestaña refleja que solo ve lo suyo.
    item.href === "/admin/tramites" && !admin ? { ...item, label: "Mis trámites" } : item
  );
  const rutaRestringida =
    !admin &&
    NAV.some((item) => item.soloAdmin && pathname.startsWith(item.href));

  // Activo también en subrutas (p. ej. /admin/tramites/5 marca "Trámites").
  const estaActivo = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF] text-[#5B6B63]">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <div className="border-b border-[#DCE4DA] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-9">
            <div>
              <div className="font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
                Panel administrativo
              </div>
              <div className="text-[13px] text-[#5B6B63]">
                {usuario?.nombre} · {usuario?.rol}
              </div>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-1.5">
              {navVisible.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold ${
                    estaActivo(item.href)
                      ? "text-[#1F6B4A]"
                      : "text-[#5B6B63]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-[#DCE4DA] px-4 py-2 text-sm font-semibold text-[#3E4A44]"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <SesionContext.Provider value={usuario}>
          {rutaRestringida ? (
            <div className="rounded-2xl border border-[#DCE4DA] bg-white p-7 text-[14.5px] text-[#3E4A44]">
              <div className="mb-1.5 font-semibold text-[#1B2420]">Sección solo para Administradores</div>
              Tu usuario no tiene permiso para esta sección.{" "}
              <Link href="/admin/tramites" className="font-semibold text-[#1F6B4A]">
                Ir a mis trámites
              </Link>
            </div>
          ) : (
            children
          )}
        </SesionContext.Provider>
      </div>
    </div>
  );
}
