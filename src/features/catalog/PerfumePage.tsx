import { useParams } from 'react-router-dom';
import { NotFoundPage } from '../../components/NotFoundPage';
import { PERFUMES } from '../../data/perfumes';
import { PerfumeView } from './PerfumeView';

export const PerfumePage = () => {
  const { id } = useParams();
  const perfume = PERFUMES.find((candidate) => candidate.id === id);

  if (!perfume) return <NotFoundPage />;

  return <PerfumeView perfume={perfume} />;
};
