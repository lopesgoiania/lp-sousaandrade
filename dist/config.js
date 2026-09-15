window.SITE_CONFIG = Object.freeze({
  // Public endpoint only. Keep CRM credentials on the receiving server.
  // Expected contract: POST JSON -> 2xx { success: true } after CRM accepts the lead.
  leadEndpoint: null,
  // User will supply the presentation video. No surrogate VSL is played.
  presentationVideo: null,
  presentationCaptions: null,
  shoppingLoop: 'assets/shopping-loop.mp4',
  parkLoop: 'assets/park-loop.mp4',
  earthVideo: 'assets/earth-approach.mp4',
  earthPoster: 'assets/earth-poster.jpg',
  illustratedMap: 'assets/territory-illustration.webp',
});
