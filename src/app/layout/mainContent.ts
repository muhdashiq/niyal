export const MAIN_CONTENT_ID = 'main-content';

export const focusMainContent = () => {
  document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
};
