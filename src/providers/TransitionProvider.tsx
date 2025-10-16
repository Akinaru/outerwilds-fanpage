import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  PropsWithChildren,
} from 'react'
import { To, useLocation, useNavigate, NavigateOptions } from 'react-router-dom'
import { gsap } from 'gsap'

type TransitionFn = (el: HTMLElement, duration: number) => gsap.core.Timeline | void

interface TransitionContextValue {
  /** Joue la transition de sortie puis exécute le callback (ex: navigate) */
  playExit: (onAfter?: () => void) => void
  /** Naviguer avec transition de sortie, puis animation d’arrivée automatique */
  navigateWithTransition: (to: To, options?: NavigateOptions) => void
  /** Remplace les animations exit/enter sans toucher le reste de l’archi */
  setAnimations: (fns: Partial<{ exit: TransitionFn; enter: TransitionFn }>) => void
  /** Change la durée des transitions (en s) */
  setTransitionDuration: (d: number) => void
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

export function usePageTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('usePageTransition must be used within <TransitionProvider>')
  return ctx
}

function awaitTimeline(tl?: gsap.core.Timeline): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!tl) return resolve()
    tl.eventCallback('onComplete', () => resolve())
  })
}

/**
 * TransitionProvider (TypeScript)
 * - Orchestration d’un layer fullscreen animé par GSAP
 * - Sortie manuelle via playExit / navigateWithTransition
 * - Entrée auto sur tout changement de route
 * - API pour remplacer facilement les animations
 */
export default function TransitionProvider({ children }: PropsWithChildren) {
  const layerRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const isFirstLoad = useRef(true)
  const running = useRef(false)
  const [duration, setDuration] = useState<number>(0.6)

  // Animations par défaut : FADE NOIR pleine page
  // - exit  : opacité 0 -> 1 (noir recouvre l'écran avant de quitter la page)
  // - enter : opacité 1 -> 0 (noir disparaît pour révéler la nouvelle page)
  const animationsRef = useRef<{
    exit: TransitionFn
    enter: TransitionFn
  }>({
    exit: (el, d) => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      tl.set(el, { display: 'block', opacity: 0 })
        .to(el, { opacity: 1, duration: d })
      return tl
    },
    enter: (el, d) => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      // On s'assure que le voile est visible (au cas d'une navigation qui n'a pas déclenché "exit")
      tl.set(el, { display: 'block', opacity: 1 })
        .to(el, { opacity: 0, duration: d })
        .set(el, { display: 'none' })
      return tl
    },
  })

  const setAnimations: TransitionContextValue['setAnimations'] = useCallback((fns) => {
    animationsRef.current = {
      exit: fns.exit ?? animationsRef.current.exit,
      enter: fns.enter ?? animationsRef.current.enter,
    }
  }, [])

  const setTransitionDuration: TransitionContextValue['setTransitionDuration'] = useCallback((d) => {
    setDuration(d)
  }, [])

  // Animation d’arrivée automatique à chaque changement de pathname (sauf au premier render)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      if (layerRef.current) {
        // Au premier chargement, on ne montre pas le voile
        gsap.set(layerRef.current, { display: 'none', opacity: 0 })
      }
      return
    }
    if (!layerRef.current) return
    const tl = animationsRef.current.enter(layerRef.current, duration)
    return () => {
      tl?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const playExit: TransitionContextValue['playExit'] = useCallback(async (onAfter) => {
    if (running.current) return
    running.current = true
    try {
      const el = layerRef.current
      if (!el) {
        onAfter?.()
        return
      }
      const tl = animationsRef.current.exit(el, duration) || undefined
      await awaitTimeline(tl)
      onAfter?.()
    } finally {
      running.current = false
    }
  }, [duration])

  const navigateWithTransition: TransitionContextValue['navigateWithTransition'] = useCallback(
    (to, options) => {
      playExit(() => navigate(to, options))
    },
    [navigate, playExit]
  )

  const ctxValue: TransitionContextValue = {
    playExit,
    navigateWithTransition,
    setAnimations,
    setTransitionDuration,
  }

  return (
    <TransitionContext.Provider value={ctxValue}>
      {/* Layer plein écran pour la transition */}
      <div
        ref={layerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',   // voile noir
          opacity: 0,           // on démarre transparent
          zIndex: 9999,
          display: 'none',
          pointerEvents: 'none',
        }}
      />
      {children}
    </TransitionContext.Provider>
  )
}
