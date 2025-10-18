import { Planet, PlanetData } from '../Planet';

export class GiantsDeep extends Planet {
  constructor() {
    const data: PlanetData = {
      id: 'giants-deep',
      name: "Giant's Deep",
      subtitle: 'Océan & cyclones',
      image: '/assets/planets/giantsdeep.jpg', // remplace par ton vrai chemin
      gravity: 'high',
      description:
        "Une géante océane balayée par des cyclones monumentaux. Les îles flottantes cachent bien des secrets.",
    };
    super(data);
  }
}
