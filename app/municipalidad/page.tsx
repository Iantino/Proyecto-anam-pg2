import type { Metadata } from "next";
import Image from "next/image";
import ImagePlaceholder from "@/components/image-placeholder";
import { datosTerritoriales, limites, patrimonioBase } from "@/lib/data";

export const metadata: Metadata = {
  title: "Municipalidad | San Pablo Jocopilas",
  description:
    "Datos territoriales, límites, patrimonio, misión y visión de la Municipalidad de San Pablo Jocopilas.",
};

export default function MunicipalidadPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-15 pb-22.5">
      <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
        El municipio
      </div>
      <h1 className="mb-6 font-(family-name:--font-lora) text-[38px] font-bold">
        Conoce San Pablo Jocopilas
      </h1>
      <p className="mb-12.5 max-w-195 text-base leading-[1.75] text-[#3E4A44]">
        San Pablo Jocopilas es un municipio situado en la parte noroeste del
        departamento de Suchitepéquez, dentro de la Región VI o Suroccidental
        de Guatemala. Su cabecera municipal se encuentra a aproximadamente 8
        kilómetros de Mazatenango, entre las cuencas de los ríos Nahualate y
        Sis-Icán, con un clima generalmente templado. La actividad económica
        se basa principalmente en la agricultura —destacan el café, banano,
        caña de azúcar, hule y cítricos— además de un trabajo artesanal en
        muebles de bambú y madera, tejidos y artículos de cuero.
      </p>

      <h2 className="mb-5 font-(family-name:--font-lora) text-2xl font-bold">
        Datos territoriales y demográficos
      </h2>
      <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px overflow-hidden rounded-2xl border border-[#DCE4DA] bg-[#DCE4DA]">
        {datosTerritoriales.map((d) => (
          <div key={d.label} className="bg-white px-5.5 py-6">
            <div className="mb-1.5 text-[13px] text-[#5B6B63]">{d.label}</div>
            <div className="text-base leading-[1.4] font-semibold text-[#1B2420]">
              {d.value}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-5 font-(family-name:--font-lora) text-2xl font-bold">
        Límites municipales
      </h2>
      <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {limites.map((l) => (
          <div
            key={l.dir}
            className="rounded-2xl border border-[#DCE4DA] bg-[#F0F5EE] p-5.5"
          >
            <div className="mb-2 text-xs font-bold tracking-[.08em] text-[#1F6B4A] uppercase">
              {l.dir}
            </div>
            <div className="text-sm leading-[1.5] text-[#3E4A44]">
              {l.desc}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-5 font-(family-name:--font-lora) text-2xl font-bold">
        Patrimonio y lugares de interés
      </h2>
      <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5.5">
        {patrimonioBase.map((lugar) => (
          <div
            key={lugar.imgId}
            className="overflow-hidden rounded-2xl border border-[#DCE4DA] bg-white"
          >
            <div className="h-42.5">
              {lugar.imgSrc ? (
                <Image
                  src={lugar.imgSrc}
                  alt={lugar.nombre}
                  width={400}
                  height={170}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder label={lugar.placeholder} />
              )}
            </div>
            <div className="p-4.5">
              <div className="mb-1.5 font-(family-name:--font-lora) text-base font-semibold">
                {lugar.nombre}
              </div>
              <div className="text-[13.5px] leading-[1.55] text-[#5B6B63]">
                {lugar.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-5 font-(family-name:--font-lora) text-2xl font-bold">
        Misión y visión
      </h2>
      <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5.5">
        <div className="rounded-2xl border border-[#DCE4DA] bg-white p-7">
          <div className="mb-3 font-(family-name:--font-lora) text-lg font-bold text-[#1F6B4A]">
            Misión
          </div>
          <p className="text-[15px] leading-[1.7] text-[#3E4A44]">
            Somos una municipalidad autónoma dedicada a promover el
            desarrollo integral de San Pablo Jocopilas mediante actividades
            económicas, sociales, culturales y deportivas. Trabajamos para
            proteger el territorio y el patrimonio natural y cultural,
            prestar servicios públicos de calidad y mejorar las condiciones
            de vida de los habitantes, fomentando la participación
            ciudadana.
          </p>
        </div>
        <div className="rounded-2xl border border-[#DCE4DA] bg-white p-7">
          <div className="mb-3 font-(family-name:--font-lora) text-lg font-bold text-[#1F6B4A]">
            Visión
          </div>
          <p className="text-[15px] leading-[1.7] text-[#3E4A44]">
            Ser una municipalidad responsable, eficiente y participativa,
            capaz de planificar, coordinar y supervisar las actividades
            económicas, sociales, culturales y deportivas del municipio,
            optimizando los recursos disponibles para mejorar los servicios
            básicos.
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-[#E3CB86] bg-[#F5E9C8] px-5 py-4 text-[13px] leading-[1.6] text-[#6B5A20]">
        Nota documental: la misión y visión anteriores son redacciones
        adaptadas de versiones institucionales documentadas públicamente y
        deben validarse con la Municipalidad antes de su publicación como
        texto oficial vigente.
      </div>
    </section>
  );
}
