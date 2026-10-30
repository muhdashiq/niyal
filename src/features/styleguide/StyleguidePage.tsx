import { BRAND_NAME } from '../../config';
import { BottleSection } from './BottleSection';
import { CartBadgeSection } from './CartBadgeSection';
import { CartStateSection } from './CartStateSection';
import { ColourSection } from './ColourSection';
import { ComponentSection } from './ComponentSection';
import styles from './Styleguide.module.css';
import { TypeSection } from './TypeSection';

export const StyleguidePage = () => (
  <>
    <div data-surface="dark" className={styles.intro}>
      <h1 className={`text-wordmark ${styles.wordmark}`}>{BRAND_NAME}</h1>
      <p className="text-lead text-muted">The design system: an atelier at dusk.</p>
    </div>
    <BottleSection />
    <CartStateSection />
    <CartBadgeSection />
    <ColourSection />
    <TypeSection />
    <ComponentSection />
  </>
);
