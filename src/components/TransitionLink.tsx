import React from 'react'
import { To, useHref } from 'react-router-dom'
import { usePageTransition } from '../providers/TransitionProvider'

export interface TransitionLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: To
  replace?: boolean
  state?: any
  children: React.ReactNode
}

/**
 * TransitionLink (TypeScript)
 * - Déclenche la sortie avant de naviguer vers `to`
 * - Respecte les modificateurs (cmd/ctrl/shift/alt) pour ouvrir un onglet sans transition
 */
export default function TransitionLink({
  to,
  replace,
  state,
  children,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const { navigateWithTransition } = usePageTransition()
  const href = useHref(to)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return

    // clic modifié => on laisse le navigateur gérer (nouvel onglet)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }

    e.preventDefault()
    navigateWithTransition(to, { replace, state })
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
