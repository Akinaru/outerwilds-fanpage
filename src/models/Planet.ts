export type GravityLevel = 'low' | 'medium' | 'high';

export interface PlanetData {
  id: string;
  name: string;
  subtitle?: string;
  image: string;        // chemin local (ex: /assets/planets/timberhearth.jpg)
  gravity: GravityLevel;
  description: string;
}

export abstract class Planet {
  public readonly id: string;
  public readonly name: string;
  public readonly subtitle?: string;
  public readonly image: string;
  public readonly gravity: GravityLevel;
  public readonly description: string;

  protected constructor(data: PlanetData) {
    this.id = data.id;
    this.name = data.name;
    this.subtitle = data.subtitle;
    this.image = data.image;
    this.gravity = data.gravity;
    this.description = data.description;
  }
}
