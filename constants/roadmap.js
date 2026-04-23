const ROADMAP = {
  "Idea": {
    objective: "Refinar la definición del problema y validar hipótesis iniciales.",
    tasks: [
      {
        id: "idea-1",
        title: "Problema definido",
        description: "El problema ya fue capturado en el diagnóstico.",
        required: true,
        autoCompleted: true,
      },
      {
        id: "idea-2",
        title: "Cliente objetivo definido",
        description: "El cliente fue definido en el onboarding.",
        required: true,
        autoCompleted: true,
      },
      {
        id: "idea-3",
        title: "Propuesta de valor definida",
        description: "La propuesta ya fue registrada.",
        required: true,
        autoCompleted: true,
      },
      {
        id: "idea-4",
        title: "Validar hipótesis inicial",
        description: "Refina tu idea con retroalimentación temprana.",
        required: true,
      },
      {
        id: "idea-5",
        title: "Investigar mercado",
        description: "Analiza soluciones existentes, competencia y contexto.",
        required: true,
      },
    ],
  },

  "Validación": {
    objective: "Comprobar que el problema existe y que la solución genera interés real en clientes potenciales.",
    tasks: [
      {
        id: "val-1",
        title: "Entrevistar clientes potenciales",
        description: "Realiza entrevistas con usuarios o clientes para validar el problema.",
        required: true,
      },
      {
        id: "val-2",
        title: "Documentar hallazgos de validación",
        description: "Resume aprendizajes, patrones y necesidades detectadas.",
        required: true,
      },
      {
        id: "val-3",
        title: "Construir un MVP básico",
        description: "Desarrolla una versión mínima del producto o servicio para probar la propuesta.",
        required: true,
      },
      {
        id: "val-4",
        title: "Probar el MVP con usuarios",
        description: "Obtén retroalimentación directa de usuarios reales.",
        required: true,
      },
      {
        id: "val-5",
        title: "Ajustar propuesta de valor",
        description: "Refina la solución con base en los resultados obtenidos.",
        required: true,
      },
    ],
  },

  "Modelo de Negocio": {
    objective: "Definir cómo el emprendimiento crea valor, entrega valor y genera ingresos.",
    tasks: [
      {
        id: "mn-1",
        title: "Definir segmento de clientes",
        description: "Especifica con claridad a qué tipo de clientes atenderás.",
        required: true,
      },
      {
        id: "mn-2",
        title: "Definir fuentes de ingreso",
        description: "Establece cómo va a generar dinero el negocio.",
        required: true,
      },
      {
        id: "mn-3",
        title: "Identificar estructura de costos",
        description: "Define costos clave para operar y escalar.",
        required: true,
      },
      {
        id: "mn-4",
        title: "Definir canales de venta y distribución",
        description: "Establece cómo llegarás al cliente y cómo entregarás la solución.",
        required: true,
      },
      {
        id: "mn-5",
        title: "Completar modelo de negocio",
        description: "Documenta el modelo completo, por ejemplo en Lean Canvas o similar.",
        required: true,
      },
    ],
  },

  "Formalización": {
    objective: "Dar estructura legal y administrativa al emprendimiento para operar formalmente.",
    tasks: [
      {
        id: "form-1",
        title: "Definir figura legal",
        description: "Selecciona la forma legal más adecuada para el negocio.",
        required: true,
      },
      {
        id: "form-2",
        title: "Registrar el negocio",
        description: "Realiza el proceso de formalización correspondiente.",
        required: true,
      },
      {
        id: "form-3",
        title: "Definir obligaciones fiscales básicas",
        description: "Identifica requisitos fiscales y administrativos iniciales.",
        required: true,
      },
      {
        id: "form-4",
        title: "Abrir cuenta bancaria del negocio",
        description: "Separa la operación financiera del negocio de la personal.",
        required: false,
      },
      {
        id: "form-5",
        title: "Organizar documentación legal",
        description: "Centraliza los documentos necesarios para la operación formal.",
        required: true,
      },
    ],
  },

  "Comercialización": {
    objective: "Conseguir clientes reales y poner en marcha la estrategia comercial.",
    tasks: [
      {
        id: "com-1",
        title: "Definir estrategia comercial",
        description: "Establece cómo venderás tu solución y a quién dirigirás los esfuerzos.",
        required: true,
      },
      {
        id: "com-2",
        title: "Definir propuesta comercial",
        description: "Estructura oferta, precio, mensaje y argumentos de venta.",
        required: true,
      },
      {
        id: "com-3",
        title: "Lanzar canales de promoción",
        description: "Activa medios o canales para dar a conocer tu solución.",
        required: true,
      },
      {
        id: "com-4",
        title: "Conseguir primeros clientes",
        description: "Realiza acciones para cerrar primeras ventas o primeros acuerdos.",
        required: true,
      },
      {
        id: "com-5",
        title: "Registrar resultados comerciales",
        description: "Documenta ventas, contactos, conversiones o aprendizajes comerciales.",
        required: true,
      },
    ],
  },

  "Operación": {
    objective: "Estandarizar la ejecución del negocio para operar con mayor control y eficiencia.",
    tasks: [
      {
        id: "op-1",
        title: "Documentar procesos clave",
        description: "Define cómo se ejecutan las actividades principales del negocio.",
        required: true,
      },
      {
        id: "op-2",
        title: "Definir roles y responsabilidades",
        description: "Aclara quién hace qué dentro del equipo.",
        required: true,
      },
      {
        id: "op-3",
        title: "Establecer indicadores operativos",
        description: "Define métricas para evaluar desempeño y operación.",
        required: true,
      },
      {
        id: "op-4",
        title: "Organizar control de recursos",
        description: "Da seguimiento a recursos, tiempos y necesidades operativas.",
        required: true,
      },
      {
        id: "op-5",
        title: "Implementar mejora operativa",
        description: "Detecta cuellos de botella y aplica mejoras básicas.",
        required: true,
      },
    ],
  },

  "Escalamiento": {
    objective: "Preparar el negocio para crecer de forma ordenada, sostenible y repetible.",
    tasks: [
      {
        id: "esc-1",
        title: "Identificar oportunidades de crecimiento",
        description: "Define nuevos mercados, clientes o líneas de expansión.",
        required: true,
      },
      {
        id: "esc-2",
        title: "Fortalecer capacidad operativa",
        description: "Asegura que el negocio pueda soportar un mayor volumen.",
        required: true,
      },
      {
        id: "esc-3",
        title: "Estandarizar procesos para crecer",
        description: "Ajusta procesos para que sean replicables y escalables.",
        required: true,
      },
      {
        id: "esc-4",
        title: "Definir estrategia de financiamiento",
        description: "Evalúa necesidades de capital para crecimiento.",
        required: true,
      },
      {
        id: "esc-5",
        title: "Medir preparación para escalar",
        description: "Evalúa si el negocio cuenta con bases suficientes para expandirse.",
        required: true,
      },
    ],
  },

  "Internacionalización": {
    objective: "Explorar y preparar la expansión del negocio hacia mercados internacionales.",
    tasks: [
      {
        id: "int-1",
        title: "Identificar mercados objetivo",
        description: "Evalúa países o regiones con potencial para tu solución.",
        required: true,
      },
      {
        id: "int-2",
        title: "Analizar requisitos de entrada",
        description: "Revisa condiciones regulatorias, comerciales o logísticas.",
        required: true,
      },
      {
        id: "int-3",
        title: "Adaptar propuesta al mercado destino",
        description: "Ajusta producto, mensaje o modelo según el nuevo contexto.",
        required: true,
      },
      {
        id: "int-4",
        title: "Definir estrategia de expansión internacional",
        description: "Establece ruta, canal o esquema para entrar al nuevo mercado.",
        required: true,
      },
      {
        id: "int-5",
        title: "Preparar documentación clave",
        description: "Organiza requisitos comerciales, legales o de exportación aplicables.",
        required: true,
      },
    ],
  },
};

const STAGES_ORDER = [
  "Idea",
  "Validación",
  "Modelo de Negocio",
  "Formalización",
  "Comercialización",
  "Operación",
  "Escalamiento",
  "Internacionalización",
];

module.exports = {
    ROADMAP,
    STAGES_ORDER
}