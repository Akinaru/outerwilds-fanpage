import React from 'react';
import { TimberHearth } from '../models/planets/TimberHearth';
import { GiantsDeep } from '../models/planets/GiantsDeep';
import { Planet } from '../models/Planet';

const Home: React.FC = () => {
  // Instancie tes modèles ici
  const planets: Planet[] = [new TimberHearth(), new GiantsDeep()];

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="px-6 md:px-10 py-8">
        <h1 className="text-3xl md:text-5xl font-serif-gothic">Système Solaire</h1>
        <p className="text-white/70 mt-2">
          Présentation des planètes (exemple avec deux modèles).
        </p>
      </header>

      <main className="hidden px-6 md:px-10 space-y-16 md:space-y-24 pb-20">
        {planets.map((p, i) => {
          const alignLeft = i % 2 === 0;
          return (
            <section
              key={p.id}
              aria-labelledby={`planet-${p.id}`}
              className="mx-auto w-full max-w-6xl"
            >
              <div
                className={[
                  'grid gap-6 md:gap-10 items-center',
                  'md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
                  alignLeft ? '' : 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1',
                ].join(' ')}
              >
                {/* Visuel */}
                <div className={alignLeft ? 'justify-self-start' : 'justify-self-end'}>
                  <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="block h-[40vh] w-full object-cover md:h-[50vh]"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Contenu */}
                <div className={alignLeft ? 'md:pl-8' : 'md:pr-8'}>
                  <h2
                    id={`planet-${p.id}`}
                    className="text-2xl md:text-4xl font-serif-gothic tracking-wide"
                  >
                    {p.name}
                  </h2>
                  {p.subtitle && (
                    <p className="mt-1 text-orange/90 uppercase tracking-wider text-xs md:text-sm">
                      {p.subtitle}
                    </p>
                  )}
                  <p className="mt-4 text-white/85">{p.description}</p>
                  <div className="mt-4 text-sm text-white/60">
                    Gravité&nbsp;: <span className="uppercase">{p.gravity}</span>
                  </div>

                  {/* CTA placeholder si besoin plus tard */}
                  {/* <button className="mt-6 px-4 py-2 rounded border border-white/20">
                    Voir la fiche
                  </button> */}
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default Home;