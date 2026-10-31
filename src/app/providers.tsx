import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { HashRouter } from 'react-router-dom';
import { CartProvider } from '../features/cart/CartProvider';
import { CartUiProvider } from '../features/cart/CartUiProvider';
import { LocaleProvider } from '../i18n/LocaleProvider';
import type { Messages } from '../i18n/messages/en';
import type { LocaleSettings } from '../i18n/settings';

type AppProvidersProps = {
  initialSettings: LocaleSettings;
  initialMessages: Messages;
  children: ReactNode;
};

const loadMotionFeatures = () =>
  import('../lib/motionFeatures').then(({ domAnimation }) => domAnimation);

export const AppProviders = ({ initialSettings, initialMessages, children }: AppProvidersProps) => (
  <HashRouter>
    <LocaleProvider initialSettings={initialSettings} initialMessages={initialMessages}>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <CartProvider>
            <CartUiProvider>{children}</CartUiProvider>
          </CartProvider>
        </MotionConfig>
      </LazyMotion>
    </LocaleProvider>
  </HashRouter>
);
