/**
 * Global keyboard shortcuts. Reads view + paused + expandAll from
 * signals (so it always sees current state), dispatches through the
 * action functions. Skips when typing inside an input/textarea, when
 * the modal is open, or when the timeline drawer claims the keys.
 */

import { view, paused, expandAll, modal } from '../store/signals'
import {
  setPaused,
  setView,
  setExpandAll,
  setSearchQuery,
} from './actions'

type TimelineHooks = {
  isDrawerOpen: () => boolean
  closeDrawer: () => void
  navigate: (dir: number) => void
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false
  if (el.isContentEditable) return true
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

export function setupKeyboardShortcuts(timelineGetter: () => TimelineHooks | null): void {
  document.addEventListener('keydown', (e) => {
    const target = e.target
    const search = document.getElementById('searchInput') as HTMLInputElement | null

    // Search input owns its own Esc handling (clears query + blurs).
    if (search && target === search) {
      if (e.key === 'Escape') {
        search.value = ''
        setSearchQuery('')
        search.blur()
      }
      return
    }

    // Don't hijack typing inside any other input/textarea (e.g. modal).
    if (isTypingTarget(target)) return

    // Don't fire shortcuts while a modal dialog is open — Esc is
    // handled by the modal component itself.
    if (modal.value !== null) return

    const tl = timelineGetter()

    if (e.key === 'Escape') {
      if (tl && tl.isDrawerOpen()) {
        tl.closeDrawer()
        return
      }
    }
    if (view.value === 'timeline' && tl && tl.isDrawerOpen()) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        tl.navigate(-1)
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        tl.navigate(1)
        return
      }
    }

    if (e.key === ' ') {
      e.preventDefault()
      setPaused(!paused.value)
    } else if (e.key === 'v' || e.key === 'V') {
      e.preventDefault()
      setView(view.value === 'timeline' ? 'dashboard' : 'timeline')
    } else if (e.key === 'e' || e.key === 'E') {
      if (view.value !== 'timeline') setExpandAll(!expandAll.value)
    } else if (e.key === '/') {
      e.preventDefault()
      search?.focus()
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault()
      search?.focus()
    }
  })
}
