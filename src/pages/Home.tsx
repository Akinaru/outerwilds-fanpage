import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import logo from '../assets/img/outer_wilds_logo.png'
import ScrambleText from '../components/ScrambleText'

gsap.registerPlugin(ScrollTrigger)

const Home: React.FC = () => {
  const logoRef = useRef<HTMLImageElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ajoute la classe au chargement pour bloquer le scroll dès le départ
    document.body.classList.add('block-scroll')

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onLeave: () => {
            // Libère le scroll proprement
            document.body.classList.remove('block-scroll')
          },
        },
      })

      tl.fromTo(
        logoRef.current,
        { scale: 0.5, opacity: 0 },
        {
          scale: 2,
          opacity: 1,
          y: -100,
          ease: 'power2.out',
        }
      )
    })

    return () => {
      ctx.revert()
      document.body.classList.remove('block-scroll')
    }
  }, [])

  return (
    <div className='bg-black text-white'>
      {/* SECTION BLOQUÉE POUR ANIMATION */}
      <div
        ref={triggerRef}
        className='h-screen flex items-center justify-center relative z-10'
      >
        <img
          ref={logoRef}
          src={logo}
          alt='Outer Wilds Logo'
          className='w-32 md:w-48'
        />
      </div>

      <div className='relative z-0 px-8 py-10'>

      </div>

      {/* SECTION LIBRE APRÈS SCROLL */}
      <div className='relative z-0 px-8 py-10'>
        {Array.from({ length: 200 }, (_, index) => (
          <p key={index}>Ligne {index + 1}</p>
        ))}
        <h1 className='text-4xl mt-10'>Bienvenue sur la page d'accueil</h1>
      </div>
    </div>
  )
}

export default Home
