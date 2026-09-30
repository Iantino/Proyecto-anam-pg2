"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Usuario = {
  id: number;
  nombre: string;
  usuario: string;
  estado: string;
  fecha_creacion: string;
  rol: string;
};

type Rol = { id: number; nombre: string; descripcion: string };

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargando, setCargando] = useState(true);
  const [sinPermiso, setSinPermiso] = useState(false);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [usuarioLogin, setUsuarioLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rolId, setRolId] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function cargar() {
    try {
      const [listaUsuarios, listaRoles] = await Promise.all([
        apiFetch("/api/usuarios"),
        apiFetch("/api/usuarios/roles/lista"),
      ]);
      setUsuarios(listaUsuarios);
      setRoles(listaRoles);
      if (listaRoles.length > 0) setRolId(String(listaRoles[0].id));
    } catch (err) {
      // 403: el usuario logueado no es Administrador.
      setSinPermiso(true);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleCrear(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !usuarioLogin.trim() || !password || !rolId) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setGuardando(true);
    try {
      await apiFetch("/api/usuarios", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          usuario: usuarioLogin,
          password,
          rol_id: Number(rolId),
        }),
      });
      setNombre("");
      setUsuarioLogin("");
      setPassword("");
      setMostrarForm(false);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el usuario.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleToggleEstado(u: Usuario) {
    try {
      const nuevoEstado = u.estado === "activo" ? "inactivo" : "activo";
      await apiFetch(`/api/usuarios/${u.id}`, {
        method: "PUT",
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      await cargar();
    } catch {
      // Sesión expirada: el layout de /admin redirige a /admin/login.
    }
  }

  if (cargando) return <p className="text-sm text-[#5B6B63]">Cargando...</p>;

  if (sinPermiso) {
    return (
      <p className="text-sm text-[#5B6B63]">
        No tienes permiso para ver esta sección. Solo el rol Administrador
        puede administrar usuarios.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
          Usuarios ({usuarios.length})
        </h2>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-[#1F6B4A] px-4 py-2 text-sm font-semibold text-white"
        >
          {mostrarForm ? "Cancelar" : "+ Nuevo usuario"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleCrear}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#DCE4DA] bg-white p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                Usuario (para iniciar sesión)
              </label>
              <input
                type="text"
                value={usuarioLogin}
                onChange={(e) => setUsuarioLogin(e.target.value)}
                className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                Contraseña (mínimo 8 caracteres)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                Rol
              </label>
              <select
                value={rolId}
                onChange={(e) => setRolId(e.target.value)}
                className="w-full rounded-[9px] border border-[#DCE4DA] bg-white px-3.5 py-2.5 text-[14.5px]"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="text-[13.5px] text-[#B3261E]">{error}</div>}

          <button
            type="submit"
            disabled={guardando}
            className="self-start rounded-lg bg-[#1F6B4A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? "Creando..." : "Crear usuario"}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between rounded-2xl border border-[#DCE4DA] bg-white p-5"
          >
            <div>
              <div className="font-semibold text-[#1B2420]">
                {u.nombre}{" "}
                <span className="font-normal text-[#5B6B63]">· {u.usuario}</span>
              </div>
              <div className="text-[13px] text-[#5B6B63]">
                {u.rol} · Creado {u.fecha_creacion}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  u.estado === "activo"
                    ? "bg-[#E8F3EC] text-[#1F6B4A]"
                    : "bg-[#F5E8E8] text-[#B3261E]"
                }`}
              >
                {u.estado}
              </span>
              <button
                onClick={() => handleToggleEstado(u)}
                className="rounded-lg border border-[#DCE4DA] px-3 py-1.5 text-xs font-semibold text-[#3E4A44]"
              >
                {u.estado === "activo" ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
