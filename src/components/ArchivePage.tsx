import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PostType } from '../hooks/postTypes';

// ⛔️ Pas de template string dynamique ici
const allFiles = import.meta.glob('../content/**/*.json', { eager: true }) as Record<string, { default: any }>;

interface Props {
  postType: PostType;
}

const ArchivePage: React.FC<Props> = ({ postType }) => {
  const { lang } = useParams();
  const [items, setItems] = useState<{ slug: string; title: string }[]>([]);

  useEffect(() => {
    const filtered = Object.entries(allFiles)
      .filter(([path]) => path.includes(`/content/${postType.contentDir}/`))
      .map(([path, mod]) => {
        const slug = path.split('/').pop()?.replace('.json', '') || '';
        return { slug, title: mod.default.title };
      });

    setItems(filtered);
  }, [postType]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">{postType.name}</h1>
      <ul className="space-y-2">
        {items.map(({ slug, title }) => (
          <li key={slug}>
            <Link to={`/${lang}/${postType.path}/${slug}`} className="text-orange-400 hover:underline">
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArchivePage;
