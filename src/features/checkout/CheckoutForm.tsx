import { useMemo } from 'react';
import { Button } from '../../components/Button';
import { Price } from '../../components/Price';
import { HOME_COUNTRY } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
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
  const { total, shipping } = useCart();
  const { t, country, countries } = useLocale();
  const { formRef, fieldProps, handleSubmit, announcement } = useCheckoutForm(onPlaceOrder);
  const countryOptions = useMemo(countries, [countries]);
  const isHomeDelivery = country === HOME_COUNTRY;

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={handleSubmit}>
      <fieldset className={styles.section}>
        <legend className="text-h3">{t.checkout.yourDetails}</legend>
        <div className={styles.fields}>
          <div className={styles.wide}>
            <TextField label={t.checkout.fullName} autoComplete="name" maxLength={80} {...fieldProps('name')} />
          </div>
          <TextField
            label={t.checkout.mobile}
            hint={isHomeDelivery ? undefined : t.checkout.mobileHintAbroad}
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete={isHomeDelivery ? 'tel-national' : 'tel'}
            maxLength={22}
            {...fieldProps('phone')}
          />
          <TextField
            label={t.checkout.email}
            optional
            type="email"
            inputMode="email"
            dir="ltr"
            autoComplete="email"
            maxLength={120}
            {...fieldProps('email')}
          />
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className="text-h3">{t.checkout.deliveryAddress}</legend>
        <div className={styles.fields}>
          <div className={styles.wide}>
            <SelectField label={t.checkout.country} autoComplete="country" {...fieldProps('country')}>
              {countryOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </SelectField>
          </div>
          <div className={styles.wide}>
            <TextField
              label={t.checkout.addressLine1}
              autoComplete="address-line1"
              maxLength={120}
              {...fieldProps('addressLine1')}
            />
          </div>
          <div className={styles.wide}>
            <TextField
              label={t.checkout.addressLine2}
              optional
              autoComplete="address-line2"
              maxLength={120}
              {...fieldProps('addressLine2')}
            />
          </div>
          <TextField
            label={t.checkout.city}
            autoComplete="address-level2"
            maxLength={60}
            {...fieldProps('city')}
          />
          {isHomeDelivery ? (
            <SelectField label={t.checkout.state} autoComplete="address-level1" {...fieldProps('state')}>
              <option value="">{t.checkout.chooseState}</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state} lang="en">
                  {state}
                </option>
              ))}
            </SelectField>
          ) : (
            <TextField
              label={t.checkout.region}
              optional
              autoComplete="address-level1"
              maxLength={60}
              {...fieldProps('state')}
            />
          )}
          <TextField
            label={isHomeDelivery ? t.checkout.pin : t.checkout.postalCode}
            optional={!isHomeDelivery}
            inputMode={isHomeDelivery ? 'numeric' : 'text'}
            dir="ltr"
            autoComplete="postal-code"
            maxLength={isHomeDelivery ? 7 : 16}
            {...fieldProps('pin')}
          />
        </div>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className="text-h3">{t.checkout.notesHeading}</legend>
        <TextAreaField
          label={t.checkout.notes}
          optional
          hint={t.checkout.notesHint}
          maxLength={500}
          {...fieldProps('notes')}
        />
      </fieldset>

      <div className={styles.placeOrder}>
        <p className={styles.mobileTotal}>
          <span>{shipping.kind === 'courier' ? t.totals.totalBeforeCourier : t.totals.total}</span>
          <Price amount={total} size="large" />
        </p>
        <Button type="submit">{t.checkout.placeOrder}</Button>
        <p className="text-small text-muted">{t.checkout.opensInWhatsapp}</p>
        {shipping.kind === 'courier' && <p className="text-small text-muted">{t.shipping.notice}</p>}
      </div>

      <p role="status" className="visually-hidden">
        {announcement}
      </p>
    </form>
  );
};
