import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../../config';
import styles from './Wordmark.module.css';

export const Wordmark = () => (
  <Link to="/" aria-label={`${BRAND_NAME} home`} className={`text-wordmark ${styles.wordmark}`}>
    {BRAND_NAME}
  </Link>
);
