import Image from "next/image";
import Link from "next/link";
import ImagePlaceholder from "@/components/image-placeholder";
import {
  contactInfo,
  patrimonioBase,
  statItems,
  tramiteShortcuts,
} from "@/lib/data";

export default function InicioPage() {
  const patrimonioTeaser = patrimonioBase.slice(0, 3);

  return (
    <>
      <section className="relative flex min-h-[560px] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/portada-la-portada.webp"
            alt="La Portada de San Pablo Jocopilas"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,35,26,0.88)_0%,rgba(15,35,26,0.72)_42%,rgba(15,35,26,0.35)_75%,rgba(15,35,26,0.15)_100%)]" />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-22.5">
          <div className="max-w-160">
            <div className="mb-5.5 inline-block rounded-full border border-[#C69A2A] bg-[#C69A2A]/18 px-3.5 py-1.5 text-xs tracking-[.08em] text-[#F3DFA0] uppercase">
              Suchitepéquez · Guatemala
            </div>
            <h1 className="mb-3.5 font-(family-name:--font-lora) text-[clamp(34px,5.5vw,58px)] leading-[1.08] font-bold text-white">
              Municipalidad de San Pablo Jocopilas
            </h1>
            <p className="mb-5.5 font-(family-name:--font-lora) text-xl text-[#E8D89A] italic">
              — En Dios Confiamos —
            </p>
            <p className="mb-8.5 text-[17px] leading-[1.65] text-[#DDE7DE]">
              Servimos con cercanía y transparencia a las familias de nuestro
              municipio: información clara, trámites accesibles y un
              compromiso constante con el desarrollo de nuestras comunidades.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link
                href="/tramites"
                className="rounded-[10px] bg-[#C69A2A] px-6.5 py-3.5 text-[15px] font-semibold text-[#1B2420]"
              >
                Ver trámites municipales
              </Link>
              <Link
                href="/municipalidad"
                className="rounded-[10px] border-[1.5px] border-white/60 px-6.5 py-3.5 text-[15px] font-semibold text-white"
              >
                Conocer el municipio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="relative z-2 -mt-11.5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px overflow-hidden rounded-2xl border border-[#DCE4DA] bg-[#DCE4DA] shadow-[0_12px_30px_rgba(22,58,43,0.12)]">
          {statItems.map((stat) => (
            <div key={stat.label} className="bg-white px-5.5 py-6.5">
              <div className="font-(family-name:--font-lora) text-[28px] font-bold text-[#1F6B4A]">
                {stat.value}
              </div>
              <div className="mt-1 text-[13px] text-[#5B6B63]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-20 pb-5">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
              Bienvenida
            </div>
            <h2 className="mb-4.5 font-(family-name:--font-lora) text-[32px] font-bold">
              Un municipio de tradición cafetalera y patrimonio vivo
            </h2>
            <p className="mb-4 text-base leading-[1.75] text-[#3E4A44]">
              San Pablo Jocopilas se ubica en la parte noroeste de
              Suchitepéquez, a unos 8 kilómetros de Mazatenango. Su economía
              se sostiene principalmente en la agricultura —café, banano,
              caña de azúcar, hule y cítricos— junto con un trabajo artesanal
              reconocido en muebles de bambú y madera, tejidos y artículos de
              cuero.
            </p>
            <p className="mb-6.5 text-base leading-[1.75] text-[#3E4A44]">
              La caficultura, en particular, es fuente importante de empleo e
              ingresos para las comunidades del municipio.
            </p>
            <Link
              href="/municipalidad"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1F6B4A]"
            >
              Conocer más sobre el municipio →
            </Link>
          </div>
          <div className="h-90 overflow-hidden rounded-2xl border border-[#DCE4DA]">
            <ImagePlaceholder label="Foto del municipio o cabecera municipal" />
          </div>
        </div>
      </div>

      <div className="mt-17.5 bg-[#F0F5EE]">
        <div className="mx-auto max-w-6xl px-6 py-17.5">
          <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
            Patrimonio
          </div>
          <h2 className="mb-8.5 font-(family-name:--font-lora) text-[32px] font-bold">
            Lugares que cuentan nuestra historia
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
            {patrimonioTeaser.map((lugar) => (
              <div
                key={lugar.imgId}
                className="overflow-hidden rounded-2xl border border-[#DCE4DA] bg-white"
              >
                <div className="h-45">
                  {lugar.imgSrc ? (
                    <Image
                      src={lugar.imgSrc}
                      alt={lugar.nombre}
                      width={400}
                      height={180}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder label={lugar.placeholder} />
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-1.5 font-(family-name:--font-lora) text-lg font-semibold">
                    {lugar.nombre}
                  </div>
                  <div className="text-sm leading-[1.55] text-[#5B6B63]">
                    {lugar.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-17.5">
        <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
          Trámites frecuentes
        </div>
        <h2 className="mb-8.5 font-(family-name:--font-lora) text-[32px] font-bold">
          Gestiona tus trámites municipales
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          {tramiteShortcuts.map((t) => (
            <Link
              key={t.letter}
              href="/tramites"
              className="rounded-2xl border border-[#DCE4DA] bg-white p-6.5 text-left"
            >
              <div className="mb-3.5 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-[#E8F3EC] font-(family-name:--font-lora) font-bold text-[#1F6B4A]">
                {t.letter}
              </div>
              <div className="mb-1.5 text-base font-semibold text-[#1B2420]">
                {t.title}
              </div>
              <div className="text-sm leading-[1.5] text-[#5B6B63]">
                {t.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[#163A2B]">
        <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-center gap-8 px-6 py-16">
          <div>
            <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
              Nuestro compromiso
            </div>
            <p className="font-(family-name:--font-lora) text-[22px] leading-[1.5] text-white italic">
              &ldquo;Ser una municipalidad responsable, eficiente y
              participativa, capaz de optimizar los recursos disponibles para
              mejorar los servicios básicos y contribuir al desarrollo
              general de la población.&rdquo;
            </p>
            <Link
              href="/municipalidad"
              className="mt-5 inline-block text-sm font-semibold text-[#E8D89A]"
            >
              Leer misión y visión completa →
            </Link>
          </div>
          <div className="rounded-2xl border border-white/14 bg-white/6 p-7">
            <div className="mb-4 text-[15px] font-semibold text-white">
              Atención ciudadana
            </div>
            <div className="text-sm leading-[2] text-[#CBD8CF]">
              <div>Tel: {contactInfo.telefono}</div>
              <div>WhatsApp: {contactInfo.whatsapp}</div>
              <div>Lunes a viernes, 8:00 a 16:00</div>
            </div>
            <Link
              href="/contacto"
              className="mt-4.5 inline-block rounded-lg bg-[#C69A2A] px-5 py-3 text-sm font-semibold text-[#1B2420]"
            >
              Ir a contacto
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
