import { type FormEvent, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { HOME_COUNTRY } from '../../config';
import { useLocale } from '../../i18n/LocaleProvider';
import { loadCustomer } from './checkoutStorage';
import {
  CUSTOMER_FIELDS,
  type Customer,
  type CustomerErrors,
  type CustomerField,
  normalisePhone,
  validateCustomer,
  validateField,
} from './customer';

export const useCheckoutForm = (onValidSubmit: (customer: Customer) => void) => {
  const { t, country, setCountry } = useLocale();
  const [details, setDetails] = useState(loadCustomer);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [announcement, setAnnouncement] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  // The delivery country lives with the language and currency, because it also decides the
  // shipping shown in the bag. This form and the header both change the same value.
  const values: Customer = { ...details, country };

  const messageFor = (error: CustomerErrors[CustomerField]) => (error ? t.checkout.errors[error] : undefined);

  const describeProblems = (nextErrors: CustomerErrors) => {
    const messages = CUSTOMER_FIELDS.flatMap((field) => messageFor(nextErrors[field]) ?? []);
    return t.checkout.problems(messages.length, messages[0] ?? '');
  };

  // An Indian state or PIN means nothing to a courier abroad, and the other way round.
  const changeCountry = (nextCountry: string) => {
    const leavesOrEntersHome = (nextCountry === HOME_COUNTRY) !== (country === HOME_COUNTRY);
    setCountry(nextCountry);
    if (leavesOrEntersHome) setDetails((current) => ({ ...current, state: '', pin: '' }));
    setErrors((current) => ({
      ...current,
      state: undefined,
      pin: undefined,
      phone: current.phone && validateField('phone', details.phone, nextCountry),
    }));
  };

  // A field already showing an error rechecks as you type, so the message clears as soon as it's fixed.
  const changeField = (field: CustomerField, value: string) => {
    if (field === 'country') {
      changeCountry(value);
      return;
    }
    setDetails((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value, country) }));
    }
  };

  const blurField = (field: CustomerField) => {
    const error = validateField(field, values[field], country);
    setErrors((current) => ({ ...current, [field]: error }));
    setAnnouncement(messageFor(error) ?? '');
    // Tidied only for India, where the country code can safely come off. Abroad it has to stay.
    if (field === 'phone' && !error && country === HOME_COUNTRY) {
      setDetails((current) => ({ ...current, phone: normalisePhone(current.phone) }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateCustomer(values);
    const firstInvalidField = CUSTOMER_FIELDS.find((field) => nextErrors[field]);

    if (!firstInvalidField) {
      onValidSubmit(values);
      return;
    }

    // Rendered first, so the field's error is already linked to it when focus lands there.
    flushSync(() => {
      setErrors(nextErrors);
      setAnnouncement(describeProblems(nextErrors));
    });
    const firstInvalidControl = formRef.current?.elements.namedItem(firstInvalidField);
    if (firstInvalidControl instanceof HTMLElement) firstInvalidControl.focus();
  };

  const fieldProps = (field: CustomerField) => ({
    name: field,
    value: values[field],
    error: messageFor(errors[field]),
    onValueChange: (value: string) => changeField(field, value),
    onBlur: () => blurField(field),
  });

  return { formRef, fieldProps, handleSubmit, announcement };
};
