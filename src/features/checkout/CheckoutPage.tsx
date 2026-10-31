import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BRAND_NAME } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
import { usePageMeta } from '../../lib/usePageMeta';
import { openWhatsApp } from '../../lib/whatsappUrl';
import { useCart } from '../cart/CartProvider';
import { CheckoutForm } from './CheckoutForm';
import styles from './CheckoutPage.module.css';
import {
  clearPlacedOrder,
  loadPlacedOrder,
  type PlacedOrder,
  savePlacedOrder,
  saveCustomer,
} from './checkoutStorage';
import { CheckoutSummary } from './CheckoutSummary';
import type { Customer } from './customer';
import { OrderConfirmation } from './OrderConfirmation';
import { buildWhatsAppMessage, createOrderRef } from './whatsapp';

export const CheckoutPage = () => {
  const cart = useCart();
  const navigate = useNavigate();
  const { t, language } = useLocale();
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(loadPlacedOrder);
  usePageMeta({
    title: placedOrder ? t.checkout.readyTitle : t.checkout.title,
    description: t.checkout.description(BRAND_NAME),
  });

  const placeOrder = (customer: Customer) => {
    const orderRef = createOrderRef();
    const message = buildWhatsAppMessage(cart, customer, orderRef, language);
    const order = { orderRef, message };
    saveCustomer(customer);
    savePlacedOrder(order);
    setPlacedOrder(order);
    openWhatsApp(message);
  };

  const editDetails = () => {
    clearPlacedOrder();
    setPlacedOrder(null);
  };

  // The customer may not have pressed send yet, so the bag only ever empties when they ask.
  const finish = () => {
    cart.clear();
    clearPlacedOrder();
    navigate('/collection');
  };

  if (placedOrder) {
    return (
      <OrderConfirmation order={placedOrder} onEditDetails={editDetails} onFinish={finish} />
    );
  }

  if (cart.lines.length === 0) return <Navigate to="/collection" replace />;

  return (
    <div className={`page-width ${styles.page}`}>
      <h1 className={styles.title}>{t.checkout.title}</h1>
      <div className={styles.layout}>
        <div className={styles.summary}>
          <CheckoutSummary />
        </div>
        <CheckoutForm onPlaceOrder={placeOrder} />
      </div>
    </div>
  );
};
