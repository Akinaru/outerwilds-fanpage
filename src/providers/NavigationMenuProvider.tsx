import { createContext, useCallback, useContext, useEffect, useRef, useState, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import ArrowImg from '../assets/img/HUD_UI_WhiteArrow_d_Hover.png'

export type NavItem = {
  label: string
  action: () => void
  disabled?: boolean
}

type Ctx = {
  isOpen: boolean
  items: NavItem[]
  openMenu: (items?: NavItem[]) => void
  closeMenu: () => void
  setItems: (items: NavItem[]) => void
}

const NavigationMenuContext = createContext<Ctx | null>(null)

export function useNavigationMenu(): Ctx {
  const ctx = useContext(NavigationMenuContext)
  if (!ctx) throw new Error('useNavigationMenu must be used within <NavigationMenuProvider>')
  return ctx
}

type ProviderProps = PropsWithChildren<{
  initialItems?: NavItem[]
  className?: string
}>

export default function NavigationMenuProvider({
  children,
  initialItems,
  className = '',
}: ProviderProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<NavItem[]>(
    initialItems ?? [
      { label: 'Reprendre', action: () => {} },
      { label: 'Options', action: () => {} },
    ]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [isKeyboardNav, setIsKeyboardNav] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const openMenu = useCallback((newItems?: NavItem[]) => {
    if (newItems) setItems(newItems)
    setIsOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(v => !v)
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const id = window.setTimeout(() => containerRef.current?.focus(), 0)

    const lenis = (window as any)?.lenis
    lenis?.stop?.()

    const prevOverflowHtml = document.documentElement.style.overflow
    const prevOverflowBody = document.body.style.overflow
    const prevOverscroll = document.documentElement.style.overscrollBehavior
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'

    const prevent = (e: Event) => { e.preventDefault(); e.stopPropagation() }
    window.addEventListener('wheel', prevent, { passive: false, capture: true })
    window.addEventListener('touchmove', prevent, { passive: false, capture: true })

    setActiveIndex(0)

    return () => {
      clearTimeout(id)

      lenis?.start?.()

      document.documentElement.style.overflow = prevOverflowHtml
      document.body.style.overflow = prevOverflowBody
      document.documentElement.style.overscrollBehavior = prevOverscroll

      window.removeEventListener('wheel', prevent as any, { capture: true } as any)
      window.removeEventListener('touchmove', prevent as any, { capture: true } as any)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return
    if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (e.key === 'Escape') {
      closeMenu()
      return
    }
    if (e.key === 'Enter') {
      const item = items[activeIndex]
      if (item && !item.disabled) {
        item.action()
        closeMenu()
      }
      return
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setIsKeyboardNav(true)
      setActiveIndex((prev) => {
        const len = items.length
        if (len === 0) return 0
        return e.key === 'ArrowUp' ? (prev - 1 + len) % len : (prev + 1) % len
      })
    }
  }

  const listVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
    exit: { opacity: 1, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring' as const, stiffness: 300, damping: 22 },
    },
    exit: { opacity: 0, y: 8, filter: 'blur(2px)', transition: { duration: 0.15 } },
  }

  const ctxValue: Ctx = {
    isOpen,
    items,
    openMenu,
    closeMenu,
    setItems,
  }

  return (
    <NavigationMenuContext.Provider value={ctxValue}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={`fixed inset-0 z-[10000] ${className}`}
            style={{ touchAction: 'none' }}
            aria-modal="true"
            role="dialog"
            aria-label="Navigation Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="relative h-full w-full flex items-center justify-center">
              <motion.div
                className="relative select-none tracking-widest uppercase font-serif-gothic px-6 py-10"
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <div className="flex items-start justify-center">
                  <motion.div
                    className="select-none tracking-widest uppercase font-serif-gothic flex items-start justify-start flex-col text-4xl py-24 gap-2"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {items.map((item, index) => {
                      const active = index === activeIndex
                      const disabled = !!item.disabled
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="w-full relative cursor-pointer"
                          onMouseEnter={() => {
                            if (!isKeyboardNav) setActiveIndex(index)
                          }}
                          onMouseMove={() => setIsKeyboardNav(false)}
                          onClick={() => {
                            if (!disabled) {
                              item.action()
                              closeMenu()
                            }
                          }}
                        >
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-15">
                            <div className={`transition-opacity duration-100 ${active ? 'opacity-100' : 'opacity-0'}`}>
                              <img src={ArrowImg} alt="" className="h-5" />
                            </div>
                          </div>

                          <p
                            className={`text-center w-full transition-colors duration-100 ${
                              active ? 'text-[#FCDCC4]' : 'text-orange'
                            } ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
                          >
                            {t(item.label)}
                          </p>

                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-15">
                            <div className={`transition-opacity duration-100 ${active ? 'opacity-100' : 'opacity-0'}`}>
                              <img src={ArrowImg} alt="" className="h-5 rotate-180" />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NavigationMenuContext.Provider>
  )
}
