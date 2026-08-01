import Image from "next/image";
import Link from "next/link";
import { contactInfo, navItems } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0F231A] text-[#CBD8CF]">
      <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-9 px-6 py-14 pb-7">
        <div>
          <div className="mb-3.5 flex items-center gap-2.5">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#C69A2A] bg-white">
              <Image
                src="/images/logo-shield.png"
                alt="Escudo de la Municipalidad de San Pablo Jocopilas"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="font-(family-name:--font-lora) text-[15px] font-bold text-white">
              Municipalidad de
              <br />
              San Pablo Jocopilas
            </div>
          </div>
          <p className="text-[13px] leading-[1.7] text-[#9DAFA4]">
            Suchitepéquez, Guatemala.
            <br />— En Dios Confiamos —
          </p>
        </div>

        <div>
          <div className="mb-3.5 text-sm font-semibold text-white">
            Navegación
          </div>
          <div className="flex flex-col gap-2.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-left text-[13.5px] text-[#9DAFA4]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-sm font-semibold text-white">
            Contacto
          </div>
          <div className="text-[13.5px] leading-[2] text-[#9DAFA4]">
            <div>Tel: {contactInfo.telefono}</div>
            <div>WhatsApp: {contactInfo.whatsapp}</div>
            <div>{contactInfo.correo}</div>
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-sm font-semibold text-white">
            Horario de atención
          </div>
          <div className="text-[13.5px] leading-[2] text-[#9DAFA4]">
            Lunes a viernes
            <br />
            8:00 a 16:00 horas
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 px-6 py-4.5 text-center text-xs text-[#7C8F82]">
        © 2026 Municipalidad de San Pablo Jocopilas. Sitio informativo — datos
        sujetos a confirmación institucional.
      </div>
    </footer>
  );
}
