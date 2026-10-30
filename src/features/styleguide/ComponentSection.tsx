import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { Price } from '../../components/Price';
import { Tag } from '../../components/Tag';
import styles from './Styleguide.module.css';

type Surface = 'dark' | 'light';

const SAMPLE_PRICES = [1800, 3200, 6400, 12500];
const SAMPLE_FAMILIES = ['Woody', 'Floral', 'Oriental', 'Fresh', 'Gourmand', 'Citrus'];

const SurfaceSpecimens = ({ surface }: { surface: Surface }) => (
  <div data-surface={surface} className={styles.panel}>
    <h3>{surface === 'dark' ? 'On the dark surface' : 'On the light surface'}</h3>

    <div className={styles.specimen}>
      <p className="text-small text-muted">Button</p>
      <div className={styles.row}>
        <Button>Add to bag</Button>
        <Button variant="ghost">View bag</Button>
        <Button variant="text">Continue shopping</Button>
      </div>
      <div className={styles.row}>
        <Button disabled>Add to bag</Button>
        <Button variant="ghost" disabled>
          View bag
        </Button>
        <Button variant="text" disabled>
          Continue shopping
        </Button>
      </div>
    </div>

    <div className={styles.specimen}>
      <p className="text-small text-muted">Price</p>
      <div className={styles.row}>
        <Price amount={1800} size="small" />
        <Price amount={6400} />
        <Price amount={12500} size="large" />
      </div>
      <ul className={styles.priceColumn}>
        {SAMPLE_PRICES.map((amount) => (
          <li key={amount}>
            <Price amount={amount} />
          </li>
        ))}
      </ul>
    </div>

    <div className={styles.specimen}>
      <p className="text-small text-muted">Divider</p>
      <Divider />
      <Divider tone="accent" />
    </div>

    <div className={styles.specimen}>
      <p className="text-small text-muted">Tag</p>
      <div className={styles.row}>
        {SAMPLE_FAMILIES.map((family) => (
          <Tag key={family}>{family}</Tag>
        ))}
      </div>
    </div>
  </div>
);

export const ComponentSection = () => (
  <section aria-labelledby="components-heading">
    <div data-surface="light" className={styles.band}>
      <h2 id="components-heading">Components</h2>
    </div>
    <div className={styles.split}>
      <SurfaceSpecimens surface="dark" />
      <SurfaceSpecimens surface="light" />
    </div>
  </section>
);
