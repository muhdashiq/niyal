import {
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
} from 'react';
import { Select } from '../../components/Select';
import styles from './FormField.module.css';

type ShellProps = {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
};

type FieldProps = ShellProps & {
  onValueChange: (value: string) => void;
};

type ControlProps = {
  id: string;
  required: boolean;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
};

type FieldShellProps = ShellProps & {
  children: (control: ControlProps) => ReactNode;
};

const FieldShell = ({ label, optional = false, hint, error, children }: FieldShellProps) => {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ');

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="text-small text-muted">
          {hint}
        </p>
      )}
      {children({
        id,
        required: !optional,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
};

export const TextField = ({
  label,
  optional,
  hint,
  error,
  onValueChange,
  ...inputProps
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) => (
  <FieldShell label={label} optional={optional} hint={hint} error={error}>
    {(control) => (
      <input
        className={styles.input}
        onChange={(event) => onValueChange(event.target.value)}
        {...control}
        {...inputProps}
      />
    )}
  </FieldShell>
);

export const TextAreaField = ({
  label,
  optional,
  hint,
  error,
  onValueChange,
  ...textareaProps
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <FieldShell label={label} optional={optional} hint={hint} error={error}>
    {(control) => (
      <textarea
        className={`${styles.input} ${styles.textarea}`}
        onChange={(event) => onValueChange(event.target.value)}
        {...control}
        {...textareaProps}
      />
    )}
  </FieldShell>
);

export const SelectField = ({
  label,
  optional,
  hint,
  error,
  onValueChange,
  children,
  ...selectProps
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) => (
  <FieldShell label={label} optional={optional} hint={hint} error={error}>
    {(control) => (
      <Select onChange={(event) => onValueChange(event.target.value)} {...control} {...selectProps}>
        {children}
      </Select>
    )}
  </FieldShell>
);
