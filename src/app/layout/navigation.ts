// Our Story and Bespoke are sections of the home page. A query string reaches them
// because HashRouter already uses the URL hash for the route.
export const NAV_LINKS = [
  { label: 'Collection', to: '/collection' },
  { label: 'Our Story', to: '/?section=story' },
  { label: 'Bespoke', to: '/?section=bespoke' },
] as const;
