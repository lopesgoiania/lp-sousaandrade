window.SITE_CONFIG = Object.freeze({
  // Production n8n webhook. CRM/Supabase/email processing belongs to n8n.
  // Respond with 2xx { success: true } only after accepting the lead.
  n8nWebhookUrl: 'https://n8n.marketinglopes.com.br/webhook/captura-site-codex',
  vipWebhookUrl: 'URL_WEBHOOK_CLICKUP',
  empreendimento: 'Sousa Andrade — Flamboyant',
  // Custom VSL covers: provide separate 16:9 and 9:16 artwork.
  vslThumbnailHorizontal: 'assets/vsl-horizontal.webp',
  vslThumbnailVertical: 'assets/vsl-vertical.webp',
  shoppingLoop: 'assets/shopping-loop.mp4',
  parkLoop: 'assets/park-loop.mp4',
  earthVideo: 'assets/earth-approach.mp4',
  earthPoster: 'assets/earth-poster.jpg',
});
