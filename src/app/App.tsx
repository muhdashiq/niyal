import { AppLayout } from './layout/AppLayout';
import { AppProviders } from './providers';

export const App = () => (
  <AppProviders>
    <AppLayout />
  </AppProviders>
);
