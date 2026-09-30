export const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/municipalidad", label: "Municipalidad" },
  { href: "/alcalde", label: "Alcalde" },
  { href: "/tramites", label: "Trámites" },
  { href: "/transparencia", label: "Transparencia" },
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
    desc: "Fachada de la antigua iglesia colonial franciscana, lo único que sobrevivió al terremoto de Santa Marta de 1773. Fue reconocida en un certamen del Banco Industrial como una de las siete iglesias más maravillosas de Guatemala.",
    placeholder: "Foto de La Portada",
    imgSrc: "/images/portada-la-portada.webp",
  },
  {
    imgId: "patrimonio-iglesia-chocola",
    nombre: "Iglesia de Chocolá",
    desc: "Templo de la aldea Chocolá, punto de reunión de la vida religiosa y comunitaria de sus habitantes.",
    placeholder: "Foto de la iglesia de Chocolá",
    imgSrc: "/images/iglesia-chocola.webp",
  },
  // Las tres primeras tarjetas se muestran también en Inicio, por eso van
  // primero los lugares que ya tienen fotografía.
  {
    imgId: "patrimonio-reloj",
    nombre: "Reloj hidráulico de Chocolá",
    desc: "Antiguo reloj centenario construido en 1800, cuyo funcionamiento utiliza energía hidráulica.",
    placeholder: "Foto del reloj hidráulico",
    imgSrc: "/images/reloj-hidraulico-chocola.webp",
  },
  {
    imgId: "patrimonio-ventana",
    nombre: "La Ventana",
    desc: "Conocida también como cueva de los murciélagos.",
    placeholder: "Foto de La Ventana",
    imgSrc: "/images/la-ventana.webp",
  },
  {
    imgId: "patrimonio-sitio-chocola",
    nombre: "Sitio arqueológico de Chocolá",
    desc: "Vestigios de asentamiento prehispánico dentro del municipio.",
    placeholder: "Foto del sitio arqueológico",
    imgSrc: "/images/sitio-arqueologico-chocola.webp",
  },
  {
    imgId: "patrimonio-piedrona",
    nombre: "La Piedrona de Chocolá",
    desc: "Lugar ceremonial de importancia comunitaria.",
    placeholder: "Foto de La Piedrona",
    imgSrc: "/images/la-piedrona.webp",
  },
  {
    imgId: "patrimonio-ixtacapa",
    nombre: "Río Ixtacapa",
    desc: "Punto turístico natural del municipio, muy visitado por sus pobladores durante los días de asueto.",
    placeholder: "Foto del río Ixtacapa",
    imgSrc: "/images/rio-ixtacapa.webp",
  },
];

// Portal oficial de Información Pública de la Municipalidad (Ley de Acceso a
// la Información Pública, Decreto 57-2008). Las solicitudes de información
// se hacen ahí y las atiende la Unidad de Información Pública (UIP), no el
// formulario de trámites de este sitio.
export const portalInformacionPublica = {
  inicio: "https://munisanpablojocopilas.laip.gt/",
  solicitudes:
    "https://munisanpablojocopilas.laip.gt/index.php/informacion-publica/solicitudes-en-linea",
  informacionDeOficio:
    "https://munisanpablojocopilas.laip.gt/index.php/informacion-publica/informacion-de-oficio",
};

// Detecta el tipo de trámite "Información pública" por su nombre, para
// redirigir al portal en lugar de registrarlo en el formulario interno.
export function esTipoInformacionPublica(nombre: string) {
  return /informaci[oó]n\s+p[uú]blica/i.test(nombre);
}

export const tramiteShortcuts: {
  letter: string;
  title: string;
  desc: string;
  href?: string; // si es externo se abre en otra pestaña
}[] = [
  {
    letter: "A",
    title: "Información pública",
    desc: "Solicita actas, presupuesto, reglamentos y más en el portal oficial.",
    href: portalInformacionPublica.solicitudes,
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
  enlace?: { href: string; label: string }; // botón a un sitio externo
};

export const tramitesData: Tramite[] = [
  {
    id: "info-publica",
    title: "Solicitud de información pública",
    summary: "Se solicita en el Portal de Información Pública de la Municipalidad.",
    items: [
      "Actas y acuerdos del Concejo Municipal.",
      "Información sobre autoridades, empleados y asesores municipales.",
      "Presupuesto y ejecución municipal.",
      "Obras de infraestructura y proyectos municipales.",
      "Reglamentos municipales.",
      "Trámites, requisitos y otra información pública.",
    ],
    note: "Las solicitudes de información pública las atiende la Unidad de Información Pública (UIP) a través del portal oficial, conforme a la Ley de Acceso a la Información Pública (Decreto 57-2008).",
    enlace: {
      href: portalInformacionPublica.solicitudes,
      label: "Solicitar información en el portal oficial",
    },
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
    title: "Otros trámites y servicios municipales",
    summary: "Consulta directamente los requisitos, costos y horarios vigentes para estos servicios.",
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
    note: "Llámanos al 7792-6303 o escríbenos al WhatsApp 5717-2708 para conocer requisitos, costos y horarios actualizados de estos servicios.",
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
