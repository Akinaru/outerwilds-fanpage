export interface PostType {
    name: string;
    path: string; // dans les routes
    contentDir: string; // dossier contenant les données
    template: React.FC<any>;
  }
  
  import CharacterTemplate from '../pages/templates/CharacterTemplate';
  import PlanetTemplate from '../pages/templates/PlanetTemplate';
  
  export const postTypes: PostType[] = [
    {
      name: 'characters',
      path: 'characters',
      contentDir: 'characters',
      template: CharacterTemplate,
    },
    {
        name: 'planets',
        path: 'planets',
        contentDir: 'planets',
        template: PlanetTemplate,
      }
  ];
  