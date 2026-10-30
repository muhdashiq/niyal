import { Button } from '../../components/Button';
import { Price } from '../../components/Price';
import { useCart } from '../cart/CartProvider';
import styles from './CheckoutForm.module.css';
import type { Customer } from './customer';
import { SelectField, TextAreaField, TextField } from './FormField';
import { INDIAN_STATES } from './indianStates';
import { useCheckoutForm } from './useCheckoutForm';

type CheckoutFormProps = {
  onPlaceOrder: (customer: Customer) => void;
};

export const CheckoutForm = ({ onPlaceOrder }: CheckoutFormProps) => {
  const { total } = useCart();
  const { formRef, fieldProps, handleSubmit, announcement } = useCheckoutForm(onPlaceOrder);

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={handleSubmit}>
      <fieldset className={styles.section}>
        <legend className="text-h3">Your details</legend>
        <div className={styles.fields}>
          <div className={styles.wide}>
            <TextField
              label="Full name"
              autoComplete="name"
              maxLength={80}
              {...fieldProps('name')}
            />
          </div>
          <TextField
            label="Mobile number"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={16}
            {...fieldProps('phone')}
          />
          <TextField
            label="Email"
            optional
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={120}
            {...fieldProps('email')}
          />
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className="text-h3">Delivery address</legend>
        <div className={styles.fields}>
          <div className={styles.wide}>
            <TextField
              label="Address line 1"
              autoComplete="address-line1"
              maxLength={120}
              {...fieldProps('addressLine1')}
            />
          </div>
          <div className={styles.wide}>
            <TextField
              label="Address line 2"
              optional
              autoComplete="address-line2"
              maxLength={120}
              {...fieldProps('addressLine2')}
            />
          </div>
          <TextField
            label="City"
            autoComplete="address-level2"
            maxLength={60}
            {...fieldProps('city')}
          />
          <SelectField label="State" autoComplete="address-level1" {...fieldProps('state')}>
            <option value="">Choose a state or union territory</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </SelectField>
          <TextField
            label="PIN code"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={7}
            {...fieldProps('pin')}
          />
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className="text-h3">Anything we should know?</legend>
        <TextAreaField
          label="Order notes or fragrance preferences"
          optional
          hint="For example, make it less sweet, or gift wrap it."
          maxLength={500}
          {...fieldProps('notes')}
        />
      </fieldset>

      <div className={styles.placeOrder}>
        <p className={styles.mobileTotal}>
          <span>Total</span>
          <Price amount={total} size="large" />
        </p>
        <Button type="submit">Place order</Button>
        <p className="text-small text-muted">Your order opens in WhatsApp, ready to send.</p>
      </div>

      <p role="status" className="visually-hidden">
        {announcement}
      </p>
    </form>
  );
};
