import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import Logo from '../assets/img/outer_wilds_logo.png';

const NotFound: React.FC = () => {
  const lettersRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  useEffect(() => {
    lettersRef.current.forEach((el, i) => {
      if (!el) return;

      // Animation d’apparition
      gsap.fromTo(
        el,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          delay: i * 0.3,
          ease: 'power3.out',
        }
      );

      // Petite secousse occasionnelle
      const interval = setInterval(() => {
        gsap.to(el, {
          x: gsap.utils.random(-3, 3),
          y: gsap.utils.random(-3, 3),
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
        });
      }, 10000 + Math.random() * 3000); // toutes les 10 à 13s

      return () => clearInterval(interval);
    });
  }, []);

  return (
    <div className="w-screen h-screen bg-black text-white relative overflow-hidden">
      <img
        src={Logo}
        alt="Outer Wilds"
        className="absolute top-1/2 left-1/2 w-[500px] max-w-[80vw] opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
      />
      <div className="absolute top-1/2 left-1/2 text-[12rem] font-serif-gothic select-none flex gap-16 -translate-x-1/2 -translate-y-1/2">
        {['4', '0', '4'].map((char, i) => (
          <div
            key={i}
            ref={el => (lettersRef.current[i] = el)}
            className="text-orange"
          >
            {char}
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center px-4">
        <h2 className="text-xl mb-2 font-semibold">Page introuvable</h2>
        <p className="text-sm mb-4 opacity-80">
          La page que vous cherchez semble avoir disparu dans l’espace...
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 text-orange rounded-full text-2xl font-bold transition-colors"
        >
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
