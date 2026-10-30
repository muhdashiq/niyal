import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'ghost' | 'text';
type ButtonSize = 'regular' | 'compact';

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleProps;
type ButtonLinkProps = LinkProps & StyleProps;
type ButtonAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & StyleProps;

const buttonClassName = (variant: ButtonVariant, size: ButtonSize, className: string | undefined) =>
  [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'regular', type = 'button', className, children, ...buttonProps }, ref) => (
    <button ref={ref} type={type} className={buttonClassName(variant, size, className)} {...buttonProps}>
      <span className={styles.label}>{children}</span>
    </button>
  ),
);

Button.displayName = 'Button';

export const ButtonLink = ({
  variant = 'primary',
  size = 'regular',
  className,
  children,
  ...linkProps
}: ButtonLinkProps) => (
  <Link className={buttonClassName(variant, size, className)} {...linkProps}>
    <span className={styles.label}>{children}</span>
  </Link>
);

export const ButtonAnchor = ({
  variant = 'primary',
  size = 'regular',
  className,
  children,
  ...anchorProps
}: ButtonAnchorProps) => (
  <a className={buttonClassName(variant, size, className)} {...anchorProps}>
    <span className={styles.label}>{children}</span>
  </a>
);
