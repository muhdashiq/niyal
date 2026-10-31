// Our Story and Bespoke are sections of the home page. A query string reaches them
// because HashRouter already uses the URL hash for the route.
export const NAV_LINKS = [
  { label: 'collection', to: '/collection' },
  { label: 'story', to: '/?section=story' },
  { label: 'bespoke', to: '/?section=bespoke' },
] as const;
