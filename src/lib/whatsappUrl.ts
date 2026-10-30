import { WHATSAPP_NUMBER } from '../config';

const TOUCH_DEVICE_QUERY = '(hover: none) and (pointer: coarse)';

export const whatsappUrl = (message?: string) => {
  const chatUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${chatUrl}?text=${encodeURIComponent(message)}` : chatUrl;
};

// On a phone this hands over to the WhatsApp app. On a desktop, a new tab keeps the shop open.
export const openWhatsApp = (message: string) => {
  const url = whatsappUrl(message);
  if (window.matchMedia(TOUCH_DEVICE_QUERY).matches) {
    window.location.href = url;
    return;
  }
  window.open(url, '_blank', 'noopener');
};
