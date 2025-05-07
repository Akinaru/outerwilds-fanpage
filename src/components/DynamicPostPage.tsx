import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PostType } from '../hooks/postTypes';

interface Props {
  postType: PostType;
}

const DynamicPostPage: React.FC<Props> = ({ postType }) => {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    import(`../content/${postType.contentDir}/${slug}.json`)
      .then((module) => setData(module.default))
      .catch(() => setData(null));
  }, [slug, postType]);

  if (!data) return <div>Chargement...</div>;

  const Template = postType.template;
  return <Template data={data} />;
};

export default DynamicPostPage;
