export const CONSTANTS = {
  FORMAT: 'application/json',
  REQUEST_POST: 'POST',
  REQUEST_GET: 'GET',
  LANGUAGE_ENGLISH: 'en',
  HEADER_MENU_SLUG: 'header-menu',
  FOOTER_QUICK_MENU_SLUG: 'quick-links-menu',
  FOOTER_OTHER_MENU_SLUG: 'other-links-menu',
  FOOTER_MENU_SLUG: 'footer-menu',
  FOOTER_BOTTOM_MENU_SLUG: 'footer-bottom-menu',
  FOOTER_CONTENT_BLOCK_ENDPOINT: 'footerv2',
  LANDING_SLUG: 'home',
  STATUS_SUCCESS: 'SUC200',
  STATUS_FAILED: 'ERR004',
  STATUS_NOT_FOUND: 'ERR003',
  X_AUTHORIZATION_TOKEN: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
  X_NETWORK_GUID: process.env.NEXT_PUBLIC_NETWORK_GUID,
};

export const IMAGE_PATH = {
  LOGO: '/images/logo/jindal-steel-logo-black.svg',
  LOGO_LIGHT: '/images/logo/jindal-steel-logo-white.svg',
};
