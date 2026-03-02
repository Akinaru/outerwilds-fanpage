import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  PropsWithChildren,
} from 'react'
import { useTranslation } from 'react-i18next'

/* =========================
 * Types internes
 * ========================= */

type BaseItem = {
  id: string
  label: string
  disabled?: boolean
  hint?: string
}

type ButtonItem = BaseItem & {
  type: 'button'
  onAction?: () => void
}

type ToggleItem = BaseItem & {
  type: 'toggle'
  value: boolean
  onChange?: (next: boolean) => void
}

type SliderItem = BaseItem & {
  type: 'slider'
  value: number
  min: number
  max: number
  step?: number
  onChange?: (next: number) => void
}

type SelectItem = BaseItem & {
  type: 'select'
  value: string
  options: { value: string; label: string }[]
  onChange?: (next: string) => void
}

type MenuItem = ButtonItem | ToggleItem | SliderItem | SelectItem

type MenuCategory = {
  id: string
  title: string
  description?: string
  items: MenuItem[]
}

type GlobalAction = {
  id: 'swap_tab' | 'default_settings' | 'leave_menu'
  label: string
  variant?: 'primary' | 'ghost'
  disabled?: boolean
  onAction?: () => void
}

type MenuState = {
  categories: MenuCategory[]
  globalActions: GlobalAction[]
}

/* =========================
 * Config interne par défaut
 * (✏️ modifie ici la structure du menu)
 * ========================= */

function buildDefaultConfig(): MenuState {
  return {
    categories: [
      {
        id: 'audio',
        title: 'Audio',
        description: 'Réglages sonores du jeu',
        items: [
          {
            id: 'master',
            type: 'slider',
            label: 'Volume général',
            hint: 'Ajuste le volume global',
            value: 70,
            min: 0,
            max: 100,
            step: 1,
            onChange: (v) => console.log('[Audio] master →', v),
          } as SliderItem,
          {
            id: 'music',
            type: 'slider',
            label: 'Musique',
            value: 60,
            min: 0,
            max: 100,
            step: 1,
            onChange: (v) => console.log('[Audio] music →', v),
          } as SliderItem,
          {
            id: 'mute',
            type: 'toggle',
            label: 'Muet',
            hint: 'Coupe tout le son',
            value: false,
            onChange: (v) => console.log('[Audio] mute →', v),
          } as ToggleItem,
        ],
      },
      {
        id: 'gameplay',
        title: 'Gameplay',
        description: 'Paramètres de jeu',
        items: [
          {
            id: 'difficulty',
            type: 'select',
            label: 'Difficulté',
            value: 'normal',
            options: [
              { value: 'easy', label: 'Facile' },
              { value: 'normal', label: 'Normal' },
              { value: 'hard', label: 'Difficile' },
            ],
            onChange: (v) => console.log('[Gameplay] difficulty →', v),
          } as SelectItem,
          {
            id: 'reset_tutorial',
            type: 'button',
            label: 'Réinitialiser le tutoriel',
            onAction: () => console.log('[Gameplay] reset tutorial'),
          } as ButtonItem,
        ],
      },
      {
        id: 'video',
        title: 'Vidéo',
        description: 'Options graphiques',
        items: [
          {
            id: 'brightness',
            type: 'slider',
            label: 'Luminosité',
            value: 50,
            min: 0,
            max: 100,
            step: 1,
            onChange: (v) => console.log('[Video] brightness →', v),
          } as SliderItem,
          {
            id: 'fullscreen',
            type: 'toggle',
            label: 'Plein écran',
            value: true,
            onChange: (v) => console.log('[Video] fullscreen →', v),
          } as ToggleItem,
          {
            id: 'quality',
            type: 'select',
            label: 'Qualité',
            value: 'high',
            options: [
              { value: 'low', label: 'Basse' },
              { value: 'medium', label: 'Moyenne' },
              { value: 'high', label: 'Haute' },
              { value: 'ultra', label: 'Ultra' },
            ],
            onChange: (v) => console.log('[Video] quality →', v),
          } as SelectItem,
        ],
      },
    ],
    // Les callbacks sont branchés dynamiquement dans le Provider (pour connaître l'état courant)
    globalActions: [
      { id: 'swap_tab', label: 'Swap Tab', variant: 'ghost' },
      { id: 'default_settings', label: 'Default Settings', variant: 'ghost' },
      { id: 'leave_menu', label: 'Leave Menu', variant: 'primary' },
    ],
  }
}

/* =========================
 * Contexte (API publique minimale)
 * ========================= */

type Ctx = {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  // Helpers optionnels
  updateToggle: (categoryId: string, itemId: string, value: boolean) => void
  updateSlider: (categoryId: string, itemId: string, value: number) => void
  updateSelect: (categoryId: string, itemId: string, value: string) => void
  triggerButton: (categoryId: string, itemId: string) => void
}

const NavigationMenuContext = createContext<Ctx | null>(null)

export function useNavigationMenu(): Ctx {
  const ctx = useContext(NavigationMenuContext)
  if (!ctx) throw new Error('useNavigationMenu must be used within <NavigationMenuProvider>')
  return ctx
}

/* =========================
 * Provider autonome
 * ========================= */

type ProviderProps = PropsWithChildren<{
  className?: string
}>

export default function NavigationMenuProvider({ children, className = '' }: ProviderProps) {
  const { t } = useTranslation()
  const initialRef = useRef<MenuState>(buildDefaultConfig())
  const [isOpen, setIsOpen] = useState(false)
  const [menu, setMenu] = useState<MenuState>(() => initialRef.current)
  const [currentCategoryId, setCurrentCategoryId] = useState<string>(
    initialRef.current.categories[0]?.id ?? ''
  )

  const containerRef = useRef<HTMLDivElement | null>(null)

  const openMenu = useCallback(() => setIsOpen(true), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  // Échap + blocage du scroll
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      e.stopPropagation()
      setIsOpen((v) => !v)
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const id = window.setTimeout(() => containerRef.current?.focus(), 0)

    const prevOverflowHtml = document.documentElement.style.overflow
    const prevOverflowBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const prevent = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener('wheel', prevent, { passive: false, capture: true })
    window.addEventListener('touchmove', prevent, { passive: false, capture: true })

    return () => {
      clearTimeout(id)
      document.documentElement.style.overflow = prevOverflowHtml
      document.body.style.overflow = prevOverflowBody
      window.removeEventListener('wheel', prevent as any, { capture: true } as any)
      window.removeEventListener('touchmove', prevent as any, { capture: true } as any)
    }
  }, [isOpen])

  /* ===== Helpers internes : mises à jour immuables des items ===== */

  const mutateItem = useCallback(
    (
      categoryId: string,
      itemId: string,
      updater: (item: MenuItem) => MenuItem,
      after?: (updated: MenuItem) => void
    ) => {
      setMenu((prev) => {
        const next: MenuState = {
          ...prev,
          categories: prev.categories.map((cat) => {
            if (cat.id !== categoryId) return cat
            return {
              ...cat,
              items: cat.items.map((it) => {
                if (it.id !== itemId) return it
                const updated = updater(it)
                after?.(updated)
                return updated
              }),
            }
          }),
          globalActions: prev.globalActions, // inchangé
        }
        return next
      })
    },
    []
  )

  const updateToggle = useCallback(
    (categoryId: string, itemId: string, value: boolean) => {
      mutateItem(
        categoryId,
        itemId,
        (it) => (it.type === 'toggle' ? { ...it, value } : it),
        (updated) => {
          if (updated.type === 'toggle') updated.onChange?.(updated.value)
        }
      )
    },
    [mutateItem]
  )

  const updateSlider = useCallback(
    (categoryId: string, itemId: string, value: number) => {
      mutateItem(
        categoryId,
        itemId,
        (it) => (it.type === 'slider' ? { ...it, value } : it),
        (updated) => {
          if (updated.type === 'slider') updated.onChange?.(updated.value)
        }
      )
    },
    [mutateItem]
  )

  const updateSelect = useCallback(
    (categoryId: string, itemId: string, value: string) => {
      mutateItem(
        categoryId,
        itemId,
        (it) => (it.type === 'select' ? { ...it, value } : it),
        (updated) => {
          if (updated.type === 'select') updated.onChange?.(updated.value)
        }
      )
    },
    [mutateItem]
  )

  const triggerButton = useCallback(
    (categoryId: string, itemId: string) => {
      const cat = menu.categories.find((c) => c.id === categoryId)
      const it = cat?.items.find((i) => i.id === itemId)
      if (it && it.type === 'button' && !it.disabled) it.onAction?.()
    },
    [menu]
  )

  const currentCategory = useMemo(
    () => menu.categories.find((c) => c.id === currentCategoryId) ?? null,
    [menu, currentCategoryId]
  )

  /* ===== Actions globales ===== */

  const swapTab = useCallback(() => {
    const idx = menu.categories.findIndex((c) => c.id === currentCategoryId)
    if (idx === -1) return
    const next = (idx + 1) % menu.categories.length
    setCurrentCategoryId(menu.categories[next].id)
  }, [menu.categories, currentCategoryId])

  const defaultSettings = useCallback(() => {
    // reset complet à partir du "schéma" par défaut
    const fresh = buildDefaultConfig()
    initialRef.current = fresh
    setMenu(fresh)
    setCurrentCategoryId(fresh.categories[0]?.id ?? '')
  }, [])

  const leaveMenu = useCallback(() => {
    closeMenu()
  }, [closeMenu])

  // Injecte les handlers dans les actions globales (sans changer les labels/ids)
  const globalActions: GlobalAction[] = useMemo(() => {
    return (menu.globalActions || []).map((a) => {
      if (a.id === 'swap_tab') return { ...a, onAction: swapTab }
      if (a.id === 'default_settings') return { ...a, onAction: defaultSettings }
      if (a.id === 'leave_menu') return { ...a, onAction: leaveMenu }
      return a
    })
  }, [menu.globalActions, swapTab, defaultSettings, leaveMenu])

  const ctxValue: Ctx = {
    isOpen,
    openMenu,
    closeMenu,
    updateToggle,
    updateSlider,
    updateSelect,
    triggerButton,
  }

  return (
    <NavigationMenuContext.Provider value={ctxValue}>
      {children}

      {isOpen && (
        <div
          ref={containerRef}
          tabIndex={-1}
          className={`fixed inset-0 z-[10000] ${className}`}
          style={{ touchAction: 'none' }}
          role="dialog"
          aria-modal="true"
          aria-label="Options Menu"
        >
          {/* Fond noir semi-transparent */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Contenu brut, plein écran */}
          <div className="relative h-full w-full flex flex-col text-base text-neutral-200">
            {/* 1) Barre de catégories (en haut, en ligne) */}
            <div className="px-4 py-3 bg-black/40 border-b border-neutral-700">
              <div className="flex gap-2 overflow-x-auto">
                {menu.categories.map((cat) => {
                  const active = cat.id === currentCategoryId
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCurrentCategoryId(cat.id)}
                      className={[
                        'px-3 py-1 rounded whitespace-nowrap',
                        active
                          ? 'bg-neutral-800 text-white border border-neutral-600'
                          : 'bg-transparent border border-transparent hover:bg-neutral-800/50',
                      ].join(' ')}
                    >
                      {t(cat.title)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2) Contenu de la catégorie */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentCategory ? (
                <div className="max-w-3xl">
                  <div className="space-y-5">
                    {currentCategory.items.map((item) => {
                      const common = (
                        <div className="mb-1">
                          <label className="block font-medium">{t(item.label)}</label>
                          {('hint' in item && item.hint) ? (
                            <div className="text-xs text-neutral-400">{t(item.hint!)}</div>
                          ) : null}
                        </div>
                      )

                      if (item.type === 'button') {
                        return (
                          <div key={item.id} className="border border-neutral-700 rounded p-3">
                            {common}
                            <button
                              disabled={item.disabled}
                              onClick={() => triggerButton(currentCategory.id, item.id)}
                              className={`px-3 py-1 rounded border
                                ${item.disabled
                                  ? 'border-neutral-700 text-neutral-500 cursor-not-allowed'
                                  : 'border-neutral-600 hover:bg-neutral-800'}`}
                            >
                              {t(item.label)}
                            </button>
                          </div>
                        )
                      }

                      if (item.type === 'toggle') {
                        return (
                          <div key={item.id} className="border border-neutral-700 rounded p-3">
                            {common}
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                disabled={item.disabled}
                                checked={item.value}
                                onChange={(e) =>
                                  updateToggle(currentCategory.id, item.id, e.target.checked)
                                }
                                className="h-4 w-4"
                              />
                              <span>{item.value ? t('Activé') : t('Désactivé')}</span>
                            </label>
                          </div>
                        )
                      }

                      if (item.type === 'slider') {
                        return (
                          <div key={item.id} className="border border-neutral-700 rounded p-3">
                            {common}
                            <input
                              type="range"
                              min={item.min}
                              max={item.max}
                              step={item.step ?? 1}
                              value={item.value}
                              disabled={item.disabled}
                              onChange={(e) =>
                                updateSlider(currentCategory.id, item.id, Number(e.target.value))
                              }
                              className="w-full"
                            />
                            <div className="text-sm mt-1">{item.value}</div>
                          </div>
                        )
                      }

                      if (item.type === 'select') {
                        return (
                          <div key={item.id} className="border border-neutral-700 rounded p-3">
                            {common}
                            <select
                              disabled={item.disabled}
                              value={item.value}
                              onChange={(e) =>
                                updateSelect(currentCategory.id, item.id, e.target.value)
                              }
                              className="px-2 py-1 bg-black/50 border border-neutral-600 rounded"
                            >
                              {item.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {t(opt.label)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )
                      }

                      return null
                    })}
                  </div>

                  {/* 3) Description (en dessous du contenu) */}
                  {currentCategory.description ? (
                    <p className="text-sm text-neutral-400 mt-6">
                      {t(currentCategory.description)}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="text-neutral-400">—</div>
              )}
            </div>

            {/* 4) Boutons globaux (tout en bas) */}
            <div className="border-t border-neutral-700 bg-black/40 px-4 py-3 flex gap-2 justify-end">
              {globalActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onAction}
                  disabled={action.disabled}
                  className={[
                    'px-3 py-1 rounded border',
                    action.variant === 'primary'
                      ? 'border-orange-400 text-orange-200 hover:bg-orange-500/10'
                      : 'border-neutral-600 hover:bg-neutral-800',
                    action.disabled ? 'opacity-50 cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  {t(action.label)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </NavigationMenuContext.Provider>
  )
}

/* =========================
 * Utilisation minimale :
 * const { openMenu } = useNavigationMenu()
 * openMenu()
 * ========================= */
