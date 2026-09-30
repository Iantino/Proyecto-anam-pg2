import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import { contactCards } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contacto | Municipalidad de San Pablo Jocopilas",
  description:
    "Contacto, ubicación y horario de atención de la Municipalidad de San Pablo Jocopilas.",
};

export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-15 pb-22.5">
      <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
        Estamos para servirte
      </div>
      <h1 className="mb-10 font-(family-name:--font-lora) text-[38px] font-bold">
        Contacto
      </h1>

      <div className="mb-12.5 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5">
        {contactCards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-[#DCE4DA] bg-white p-5.5"
          >
            <div className="mb-2 text-xs tracking-[.06em] text-[#5B6B63] uppercase">
              {c.label}
            </div>
            <div className="text-[15.5px] leading-[1.5] font-semibold break-words text-[#1B2420]">
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4.5 font-(family-name:--font-lora) text-[22px] font-bold">
            Ubicación
          </h2>
          <div className="relative h-80 overflow-hidden rounded-2xl border border-[#DCE4DA]">
            <iframe
              src="https://www.google.com/maps?q=14.586944,-91.452778&z=15&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación de la Municipalidad de San Pablo Jocopilas"
            />
          </div>
          <p className="mt-3.5 text-[13.5px] leading-[1.6] text-[#5B6B63]">
            Calle principal, edificio municipal, cabecera municipal de San
            Pablo Jocopilas, Suchitepéquez.
          </p>
        </div>

        <div>
          <h2 className="mb-4.5 font-(family-name:--font-lora) text-[22px] font-bold">
            Escríbenos
          </h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}