import { lazy } from 'react';
import { type Location, Route, Routes } from 'react-router-dom';
import { NotFoundPage } from '../components/NotFoundPage';
import { HomePage } from '../features/home/HomePage';

// Home stays in the main bundle because most visits start there. Each other page
// downloads only when it's first opened.
const CollectionPage = lazy(() =>
  import('../features/catalog/CollectionPage').then(({ CollectionPage }) => ({ default: CollectionPage })),
);
const PerfumePage = lazy(() =>
  import('../features/catalog/PerfumePage').then(({ PerfumePage }) => ({ default: PerfumePage })),
);
const CartPage = lazy(() =>
  import('../features/cart/CartPage').then(({ CartPage }) => ({ default: CartPage })),
);
const CheckoutPage = lazy(() =>
  import('../features/checkout/CheckoutPage').then(({ CheckoutPage }) => ({ default: CheckoutPage })),
);
// A design reference for development only. Production builds leave it out entirely.
const StyleguidePage = import.meta.env.DEV
  ? lazy(() =>
      import('../features/styleguide/StyleguidePage').then(({ StyleguidePage }) => ({
        default: StyleguidePage,
      })),
    )
  : null;

type AppRoutesProps = {
  location: Location;
};

export const AppRoutes = ({ location }: AppRoutesProps) => (
  <Routes location={location}>
    <Route path="/" element={<HomePage />} />
    <Route path="/collection" element={<CollectionPage />} />
    <Route path="/perfume/:id" element={<PerfumePage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    {StyleguidePage && <Route path="/styleguide" element={<StyleguidePage />} />}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
