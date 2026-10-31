import type { ReactNode } from 'react';

const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const LargeIcon = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 48 48"
    width="48"
    height="48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const ListenIcon = () => (
  <LargeIcon>
    <path d="M13 20a11.5 11.5 0 1 1 23 0c0 5.5-2.8 7.8-5.6 10.6-2.6 2.6-1.9 9.4-8.4 9.4-3.8 0-6-2.8-6-5.8" />
    <path d="M19 20a5.5 5.5 0 0 1 11 0c0 2.8-1.8 3.9-3.6 5" />
  </LargeIcon>
);

export const ComposeIcon = () => (
  <LargeIcon>
    <rect x="20" y="4" width="8" height="10" rx="4" />
    <path d="M17.5 14h13" />
    <path d="M21 14v17l3 6 3-6V14" />
    <path d="M24 41c-1.6 2-2.2 3-2.2 3.8a2.2 2.2 0 0 0 4.4 0c0-.8-.6-1.8-2.2-3.8z" />
  </LargeIcon>
);

export const BottleIcon = () => (
  <LargeIcon>
    <rect x="19.5" y="4" width="9" height="9" />
    <path d="M21.5 13v4M26.5 13v4" />
    <path d="M13.5 21l4-4h13l4 4v20l-4 4h-13l-4-4z" />
    <path d="M13.5 27h21" />
  </LargeIcon>
);

export const BagIcon = () => (
  <Icon>
    <path d="M5.5 8.5h13l1 12h-15z" />
    <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
  </Icon>
);

export const MenuIcon = () => (
  <Icon>
    <path d="M4 9h16M4 15h16" />
  </Icon>
);

export const MinusIcon = () => (
  <Icon>
    <path d="M6 12h12" />
  </Icon>
);

export const PlusIcon = () => (
  <Icon>
    <path d="M6 12h12M12 6v12" />
  </Icon>
);

export const GlobeIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5s1.2-6.1 3.6-8.5Z" />
  </Icon>
);

export const ChevronDownIcon = () => (
  <Icon>
    <path d="M6 9.5l6 6 6-6" />
  </Icon>
);

export const CheckIcon = () => (
  <Icon>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const CloseIcon = () => (
  <Icon>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);
