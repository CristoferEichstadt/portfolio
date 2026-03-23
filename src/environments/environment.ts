declare const __WHATSAPP__: string;
declare const __WHATSAPP_DISPLAY__: string;

function sanitizeInjectedValue(value: string | undefined, placeholder: string): string {
  if (typeof value === 'undefined') return '';

  const normalized = value.trim();
  if (!normalized || normalized === placeholder) return '';

  return normalized;
}

const whatsapp = sanitizeInjectedValue(
  typeof __WHATSAPP__ !== 'undefined' ? __WHATSAPP__ : undefined,
  'PLACEHOLDER_WHATSAPP'
);

const whatsappDisplay = sanitizeInjectedValue(
  typeof __WHATSAPP_DISPLAY__ !== 'undefined' ? __WHATSAPP_DISPLAY__ : undefined,
  'PLACEHOLDER_WHATSAPP_DISPLAY'
);

export const environment = {
  production: false,
  whatsapp,
  whatsappDisplay,
  hasWhatsapp: !!whatsapp,
};
