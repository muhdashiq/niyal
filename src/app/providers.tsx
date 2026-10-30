import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { HashRouter } from 'react-router-dom';
import { CartProvider } from '../features/cart/CartProvider';
import { CartUiProvider } from '../features/cart/CartUiProvider';

type AppProvidersProps = { children: ReactNode };

const loadMotionFeatures = () =>
  import('../lib/motionFeatures').then(({ domAnimation }) => domAnimation);

export const AppProviders = ({ children }: AppProvidersProps) => (
  <HashRouter>
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <CartUiProvider>{children}</CartUiProvider>
        </CartProvider>
      </MotionConfig>
    </LazyMotion>
  </HashRouter>
);
