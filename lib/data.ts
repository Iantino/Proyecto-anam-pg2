export const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/municipalidad", label: "Municipalidad" },
  { href: "/tramites", label: "Trámites" },
  { href: "/contacto", label: "Contacto" },
];

export const contactInfo = {
  telefono: "+502 7792-6303",
  whatsapp: "+502 5717-2708",
  correo: "municipalidadsanpablojocopilas@gmail.com",
  horario: "Lunes a viernes, 8:00 a 16:00 horas",
};

export const statItems = [
  { label: "Población (Censo 2018)", value: "20,433 hab." },
  { label: "Extensión territorial", value: "26.11 km²" },
  { label: "Distancia a Mazatenango", value: "~8 km" },
  { label: "Clima", value: "~25 °C, templado" },
];

export type Lugar = {
  imgId: string;
  nombre: string;
  desc: string;
  placeholder: string;
  imgSrc?: string;
};

export const patrimonioBase: Lugar[] = [
  {
    imgId: "patrimonio-portada",
    nombre: "La Portada de San Pablo Jocopilas",
    desc: "Uno de los principales símbolos culturales del municipio.",
    placeholder: "Foto de La Portada",
    imgSrc: "/images/portada-la-portada.webp",
  },
  {
    imgId: "patrimonio-chocola",
    nombre: "Sitio arqueológico de Chocolá",
    desc: "Vestigios de asentamiento prehispánico dentro del municipio.",
    placeholder: "Foto del sitio arqueológico",
  },
  {
    imgId: "patrimonio-reloj",
    nombre: "Reloj hidráulico de Chocolá",
    desc: "Antiguo reloj cuyo funcionamiento utiliza energía hidráulica.",
    placeholder: "Foto del reloj hidráulico",
  },
  {
    imgId: "patrimonio-ventana",
    nombre: "La Ventana",
    desc: "Conocida también como cueva de los murciélagos.",
    placeholder: "Foto de La Ventana",
  },
  {
    imgId: "patrimonio-piedrona",
    nombre: "La Piedrona de Chocolá",
    desc: "Lugar ceremonial de importancia comunitaria.",
    placeholder: "Foto de La Piedrona",
  },
];

export const tramiteShortcuts = [
  {
    letter: "A",
    title: "Información pública",
    desc: "Solicita actas, presupuesto, reglamentos y más.",
  },
  {
    letter: "B",
    title: "IUSI",
    desc: "Consulta, pago y solvencia de tu inmueble.",
  },
  {
    letter: "C",
    title: "Constancias",
    desc: "Residencia, ingresos, cargas familiares y otras.",
  },
];

export const datosTerritoriales = [
  { label: "Extensión territorial", value: "26.11 km²" },
  { label: "Distancia a Mazatenango", value: "Aproximadamente 8 kilómetros" },
  { label: "Población, Censo 2018", value: "20,433 habitantes" },
  { label: "Proyección INE 2019", value: "22,795 habitantes" },
  { label: "Clima", value: "Templado, ~25 °C anual" },
  {
    label: "Principales comunidades",
    value: "Chocolá, Madre Mía, La Ladrillera, Lolemí y Las Piedritas",
  },
];

export const limites = [
  {
    dir: "Norte",
    desc: "Santa Catarina Ixtahuacán, departamento de Sololá.",
  },
  { dir: "Sur", desc: "San Antonio Suchitepéquez y Samayac." },
  { dir: "Este", desc: "Santo Tomás La Unión y San Antonio Suchitepéquez." },
  { dir: "Oeste", desc: "Samayac." },
];

export type Tramite = {
  id: string;
  title: string;
  summary: string;
  items: string[];
  note?: string;
};

export const tramitesData: Tramite[] = [
  {
    id: "info-publica",
    title: "Solicitud de información pública",
    summary: "Formulario en línea para consultar información municipal.",
    items: [
      "Actas y acuerdos del Concejo Municipal.",
      "Información sobre autoridades, empleados y asesores municipales.",
      "Presupuesto y ejecución municipal.",
      "Obras de infraestructura y proyectos municipales.",
      "Reglamentos municipales.",
      "Trámites, requisitos y otra información pública.",
    ],
    note: "Para el seguimiento se solicita nombre y correo electrónico, además de una descripción clara de la información requerida. DPI, teléfono y boleto de ornato son datos complementarios.",
  },
  {
    id: "iusi",
    title: "Impuesto Único Sobre Inmuebles (IUSI)",
    summary: "Consulta, pago, solvencia e inscripción de inmuebles.",
    items: [
      "Consulta del estado de cuenta del IUSI.",
      "Pago del impuesto y obtención del recibo correspondiente.",
      "Actualización del estado de cuenta del contribuyente.",
      "Solicitud de solvencia del IUSI.",
      "Inscripción de inmuebles en la base de datos municipal.",
    ],
  },
  {
    id: "inscripcion-inmuebles",
    title: "Inscripción municipal de inmuebles",
    summary: "Registro de un inmueble ante la Municipalidad.",
    items: [
      "Escritura pública del inmueble.",
      "Aviso notarial.",
      "Copia simple de la escritura.",
      "Copia del Número de Identificación Tributaria (NIT).",
      "Fotocopia del Documento Personal de Identificación (DPI) del propietario.",
    ],
    note: "Estos requisitos provienen de un manual histórico: confírmalos con la unidad municipal del IUSI antes de acudir a realizar el trámite.",
  },
  {
    id: "certificaciones",
    title: "Certificaciones y constancias municipales",
    summary: "Constancias de residencia, cargas familiares, becas y más.",
    items: [
      "Constancia de residencia.",
      "Constancia de cargas familiares.",
      "Constancia de sobrevivencia para personas adultas mayores.",
      "Constancia de ubicación de establecimientos educativos.",
      "Constancia de ingresos.",
      "Certificación de actas de matrimonio municipal.",
      "Constancias laborales municipales.",
      "Certificación de actas municipales.",
      "Constancias para becas escolares.",
      "Certificados de personalidad jurídica de organizaciones.",
      "Copias o certificaciones de actuaciones municipales.",
    ],
  },
  {
    id: "pagos",
    title: "Pagos municipales",
    summary: "Tasas, arbitrios, contribuciones y servicios públicos.",
    items: [
      "Tasas municipales.",
      "Arbitrios.",
      "Contribuciones municipales.",
      "Servicios públicos municipales.",
      "Impuesto Único Sobre Inmuebles (IUSI).",
      "Otros ingresos autorizados por la Municipalidad.",
    ],
  },
  {
    id: "por-confirmar",
    title: "Trámites que deben confirmarse directamente",
    summary: "Requisitos y costos aún no verificados en el portal municipal.",
    items: [
      "Emisión y pago del boleto de ornato.",
      "Solicitud, traslado o reconexión del servicio de agua.",
      "Pago del servicio municipal de agua.",
      "Solvencia municipal general.",
      "Licencias de construcción.",
      "Licencias o permisos para establecimientos comerciales.",
      "Autorización de ventas, ferias y eventos.",
      "Permisos para anuncios publicitarios.",
      "Servicios y autorizaciones de cementerio.",
      "Permisos relacionados con tala o poda de árboles.",
      "Gestiones relacionadas con drenajes y saneamiento.",
      "Registro o actualización de negocios.",
      "Denuncias y reportes sobre servicios municipales.",
    ],
    note: "Para confirmar requisitos, costos, horarios y disponibilidad llama al 7792-6303 o escribe al WhatsApp 5717-2708.",
  },
];

export const contactCards = [
  { label: "Institución", value: "Municipalidad de San Pablo Jocopilas" },
  { label: "Departamento", value: "Suchitepéquez, Guatemala" },
  { label: "Teléfono", value: "+502 7792-6303" },
  { label: "WhatsApp", value: "+502 5717-2708 · Atención Ciudadana" },
  { label: "Correo", value: "municipalidadsanpablojocopilas@gmail.com" },
  { label: "Horario", value: "Lunes a viernes, 8:00 a 16:00 horas" },
];

export const asuntoOptions = [
  "Información general",
  "Trámites y servicios",
  "IUSI",
  "Solicitud de información pública",
  "Otro",
];
