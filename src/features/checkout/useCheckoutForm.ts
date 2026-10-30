import { type FormEvent, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
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

const describeProblems = (errors: CustomerErrors) => {
  const messages = CUSTOMER_FIELDS.flatMap((field) => errors[field] ?? []);
  const count = messages.length;
  return `${count} ${count === 1 ? 'field needs' : 'fields need'} attention. ${messages[0]}`;
};

export const useCheckoutForm = (onValidSubmit: (customer: Customer) => void) => {
  const [values, setValues] = useState(loadCustomer);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [announcement, setAnnouncement] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // A field already showing an error rechecks as you type, so the message clears as soon as it's fixed.
  const changeField = (field: CustomerField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    }
  };

  const blurField = (field: CustomerField) => {
    const error = validateField(field, values[field]);
    setErrors((current) => ({ ...current, [field]: error }));
    setAnnouncement(error ?? '');
    if (field === 'phone' && !error) {
      setValues((current) => ({ ...current, phone: normalisePhone(current.phone) }));
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
    error: errors[field],
    onValueChange: (value: string) => changeField(field, value),
    onBlur: () => blurField(field),
  });

  return { formRef, fieldProps, handleSubmit, announcement };
};
