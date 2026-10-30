import { ButtonLink } from '../../components/Button';
import styles from './EmptyBag.module.css';

type EmptyBagProps = {
  onNavigate?: () => void;
};

export const EmptyBag = ({ onNavigate }: EmptyBagProps) => (
  <div className={styles.empty}>
    <p className="text-h3">Your bag is empty</p>
    <p className="text-muted">Start with the collection and add a bottle in the size that suits you.</p>
    <ButtonLink to="/collection" onClick={onNavigate}>
      Explore the collection
    </ButtonLink>
  </div>
);
