import { Planet, PlanetData } from '../Planet';

export class TimberHearth extends Planet {
  constructor() {
    const data: PlanetData = {
      id: 'timber-hearth',
      name: 'Timber Hearth',
      subtitle: 'Forêts & grottes',
      image: '/assets/planets/timberhearth.jpg',
      gravity: 'medium',
      description:
        "Le berceau des Hearthians. Un terrain boisé avec de nombreuses grottes et un observatoire emblématique.",
    };
    super(data);
  }
}
