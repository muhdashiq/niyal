import type { Messages } from '../i18n/messages/en';
import type { LocaleSettings } from '../i18n/settings';
import { AppLayout } from './layout/AppLayout';
import { AppProviders } from './providers';

type AppProps = {
  initialSettings: LocaleSettings;
  initialMessages: Messages;
};

export const App = ({ initialSettings, initialMessages }: AppProps) => (
  <AppProviders initialSettings={initialSettings} initialMessages={initialMessages}>
    <AppLayout />
  </AppProviders>
);
