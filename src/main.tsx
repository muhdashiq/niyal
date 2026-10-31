import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { applyLanguageToDocument, loadMessages } from './i18n/loadMessages';
import { en, type Messages } from './i18n/messages/en';
import { type LocaleSettings, loadSettings } from './i18n/settings';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/scripts.css';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Missing #root element in index.html');
}

const renderApp = (settings: LocaleSettings, messages: Messages) =>
  createRoot(rootElement).render(
    <StrictMode>
      <App initialSettings={settings} initialMessages={messages} />
    </StrictMode>,
  );

const settings = loadSettings();
applyLanguageToDocument(settings.language);

// Waits for the visitor's language before the first paint, so nobody sees a flash of English.
loadMessages(settings.language).then(
  (messages) => renderApp(settings, messages),
  () => {
    applyLanguageToDocument('en');
    renderApp({ ...settings, language: 'en' }, en);
  },
);
