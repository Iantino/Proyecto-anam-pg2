import type { Metadata } from "next";
import Link from "next/link";
import TramitesAccordion from "@/components/tramites-accordion";
import SolicitudTramiteForm from "@/components/solicitud-tramite-form";
import { tramitesData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Trámites | Municipalidad de San Pablo Jocopilas",
  description:
    "Trámites y servicios municipales de San Pablo Jocopilas: información pública, IUSI, inscripción de inmuebles, certificaciones y pagos.",
};

export default function TramitesPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-15 pb-22.5">
      <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
        Servicios municipales
      </div>
      <h1 className="mb-4.5 font-(family-name:--font-lora) text-[38px] font-bold">
        Trámites y servicios
      </h1>
      <p className="mb-10 text-[15.5px] leading-[1.7] text-[#3E4A44]">
        Los procedimientos siguientes provienen de fuentes municipales e
        institucionales. Requisitos, formularios, costos y tiempos de
        respuesta pueden cambiar: confirma siempre antes de realizar tu
        trámite llamando al <strong>7792-6303</strong> o escribiendo al
        WhatsApp <strong>5717-2708</strong>.
      </p>

      <div className="mb-12">
        <h2 className="mb-1.5 font-(family-name:--font-lora) text-2xl font-bold">
          Envía tu solicitud en línea
        </h2>
        <p className="mb-5 text-[14.5px] leading-[1.7] text-[#5B6B63]">
          Regístrala directamente, sin necesidad de crear una cuenta. Te
          contactaremos al correo o teléfono que nos compartas.
        </p>
        <SolicitudTramiteForm />
      </div>

      <TramitesAccordion tramites={tramitesData} />

      <div className="mb-4.5 rounded-2xl border border-[#DCE4DA] bg-[#F0F5EE] px-7 py-6.5">
        <div className="mb-2.5 font-(family-name:--font-lora) text-[17px] font-bold">
          ¿DPI, matrimonio, NIT?
        </div>
        <p className="m-0 text-[14.5px] leading-[1.7] text-[#3E4A44]">
          La Municipalidad no gestiona directamente los trámites de otras
          instituciones: el DPI y las certificaciones de nacimiento,
          matrimonio civil y defunción corresponden al <strong>RENAP</strong>;
          la inscripción o actualización del NIT corresponde a la{" "}
          <strong>SAT</strong>.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4.5 rounded-2xl bg-[#163A2B] p-7">
        <div>
          <div className="mb-1 text-base font-semibold text-white">
            ¿No encontraste lo que buscabas?
          </div>
          <div className="text-sm text-[#CBD8CF]">
            Escríbenos y con gusto te orientamos.
          </div>
        </div>
        <Link
          href="/contacto"
          className="rounded-lg bg-[#C69A2A] px-5.5 py-3.25 text-sm font-semibold text-[#1B2420]"
        >
          Contactar a la Municipalidad
        </Link>
      </div>
    </section>
  );
}
