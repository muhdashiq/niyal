import { m, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { DURATION, EASE_SETTLE } from '../lib/motion';

type RevealProps = {
  className?: string;
  children: ReactNode;
};

const GROUP_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// Only opacity and transform change, so nothing below moves when an item appears.
const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_SETTLE } },
};

export const RevealGroup = ({ className, children }: RevealProps) => (
  <m.div
    className={className}
    variants={GROUP_VARIANTS}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    {children}
  </m.div>
);

export const RevealItem = ({ className, children }: RevealProps) => (
  <m.div className={className} variants={ITEM_VARIANTS}>
    {children}
  </m.div>
);

export const RevealListItem = ({ className, children }: RevealProps) => (
  <m.li className={className} variants={ITEM_VARIANTS}>
    {children}
  </m.li>
);
