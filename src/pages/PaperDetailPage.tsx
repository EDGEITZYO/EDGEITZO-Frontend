import { useNavigate, useSearchParams } from 'react-router-dom';

const PaperDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBack = () => {
    const returnTo = searchParams.get('returnTo');
    if (returnTo?.startsWith('/')) {
      navigate(returnTo);
      return;
    }
    navigate('/saved');
  };

  return <div>PaperDetailPage</div>;
};

export default PaperDetailPage;