/**
 * Header — title, view toggle (Dashboard/Timeline/Cache), search box,
 * controls (Pause, Auto-scroll, Expand/Collapse, Export menu, Clear),
 * event counter, status dot. All interactive state reads from signals;
 * actions go through the bridge (replaced by direct signal mutations as
 * the legacy core shrinks).
 */

import { useEffect, useRef, useState } from 'preact/hooks'
import {
  events,
  view,
  paused,
  autoScroll,
  expandAll,
  searchQuery,
  connectionStatus,
} from '../store/signals'
import { actions } from '../store/actions'

function StorybookLogo() {
  return (
    <svg width="20" height="20" viewBox="-31.5 0 319 319" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#FF4785"
        d="M9.87,293.32L0.01,30.57C-0.31,21.9,6.34,14.54,15.01,14L238.49,0.03C247.32,-0.52,254.91,6.18,255.47,15.01C255.49,15.34,255.5,15.67,255.5,16V302.32C255.5,311.16,248.33,318.32,239.49,318.32C239.25,318.32,239.01,318.32,238.77,318.31L25.15,308.71C16.83,308.34,10.18,301.65,9.87,293.32Z"
      />
      <path
        fill="#FFF"
        d="M188.67,39.13L190.19,2.41L220.88,0L222.21,37.86C222.25,39.18,221.22,40.29,219.9,40.33C219.34,40.35,218.79,40.17,218.34,39.82L206.51,30.5L192.49,41.13C191.44,41.93,189.95,41.72,189.15,40.67C188.81,40.23,188.64,39.68,188.67,39.13ZM149.41,119.98C149.41,126.21,191.36,123.22,196.99,118.85C196.99,76.45,174.23,54.17,132.57,54.17C90.91,54.17,67.57,76.79,67.57,110.74C67.57,169.85,147.35,170.98,147.35,203.23C147.35,212.28,142.91,217.65,133.16,217.65C120.46,217.65,115.43,211.17,116.02,189.1C116.02,184.32,67.57,182.82,66.09,189.1C62.33,242.57,95.64,257.99,133.75,257.99C170.69,257.99,199.65,238.3,199.65,202.66C199.65,139.3,118.68,141,118.68,109.6C118.68,96.88,128.14,95.18,133.75,95.18C139.66,95.18,150.3,96.22,149.41,119.98Z"
      />
    </svg>
  )
}

function ViewToggle() {
  const v = view.value
  const items: Array<{
    key: 'dashboard' | 'timeline' | 'cache'
    label: string
    icon: preact.JSX.Element
  }> = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      ),
    },
    {
      key: 'timeline',
      label: 'Timeline',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <circle cx="7" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="13" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="18" cy="12" r="2.2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      key: 'cache',
      label: 'Cache',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
        </svg>
      ),
    },
  ]

  return (
    <div class="view-toggle" id="viewToggle" role="tablist" aria-label="View mode">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          data-view={item.key}
          class={v === item.key ? 'active' : undefined}
          role="tab"
          title={`${item.label} view (V)`}
          onClick={() => actions().setView(item.key)}
        >
          {item.icon}
          <span class="view-toggle-label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null)

  // / focuses, Esc clears, but only when search isn't already active.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        const tag = (document.activeElement as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (inputRef.current) inputRef.current.value = ''
        actions().setSearchQuery('')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div class="search-box">
      <span class="search-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        id="searchInput"
        placeholder="Search events..."
        ref={inputRef}
        onInput={(e) => actions().setSearchQuery((e.currentTarget as HTMLInputElement).value)}
      />
      <span class="search-hint">
        <kbd class="kbd">/</kbd>
      </span>
    </div>
  )
}

function PauseButton() {
  const isPaused = paused.value
  return (
    <button
      class={'btn' + (isPaused ? ' active' : '')}
      id="pauseBtn"
      title="Pause / Resume (Space)"
      onClick={() => actions().setPaused(!paused.value)}
    >
      {isPaused ? (
        <svg id="pauseSvg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21" fill="currentColor" />
        </svg>
      ) : (
        <svg id="pauseSvg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      )}
      <span id="pauseLabel" class="btn-label">{isPaused ? 'Resume' : 'Pause'}</span>
    </button>
  )
}

function AutoScrollButton() {
  const on = autoScroll.value
  return (
    <button
      class={'btn' + (on ? ' active' : '')}
      id="scrollBtn"
      title="Auto-scroll to newest"
      onClick={() => actions().setAutoScroll(!autoScroll.value)}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
      <span class="btn-label">Auto-scroll</span>
    </button>
  )
}

function ExpandButton() {
  const on = expandAll.value
  return (
    <button
      class={'btn' + (on ? ' active' : '')}
      id="expandAllBtn"
      title="Expand / Collapse all (E)"
      onClick={() => actions().setExpandAll(!expandAll.value)}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
      <span id="expandLabel" class="btn-label">{on ? 'Collapse' : 'Expand'}</span>
    </button>
  )
}

function ExportMenu() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div class={'export-wrap' + (open ? ' open' : '')} id="exportWrap" ref={wrapRef}>
      <button
        class="btn"
        id="exportBtn"
        title="Export events"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span class="btn-label">Export</span>
        <svg class="chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div class="export-menu" id="exportMenu" role="menu">
        <button
          type="button"
          class="export-item"
          data-export="json"
          role="menuitem"
          onClick={() => {
            setOpen(false)
            actions().exportEvents()
          }}
        >
          <span class="export-item-title">Export as JSON</span>
          <span class="export-item-sub">Raw event data for tooling</span>
        </button>
        <button
          type="button"
          class="export-item"
          data-export="html"
          role="menuitem"
          onClick={() => {
            setOpen(false)
            actions().exportHtmlSnapshot()
          }}
        >
          <span class="export-item-title">Export as HTML snapshot</span>
          <span class="export-item-sub">Standalone dashboard snapshot</span>
        </button>
      </div>
    </div>
  )
}

function ClearButton() {
  return (
    <button
      class="btn danger"
      id="clearBtn"
      title="Clear all events from server and dashboard"
      onClick={() => actions().clearAll()}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
      <span class="btn-label">Clear all</span>
    </button>
  )
}

function EventCounter() {
  const n = events.value.length
  return (
    <span class="event-counter" id="eventCount" title={`${n} ${n === 1 ? 'event' : 'events'}`}>
      <span class="event-counter-num">{n}</span>{' '}
      <span class="event-counter-unit">{n === 1 ? 'event' : 'events'}</span>
    </span>
  )
}

function StatusDot() {
  // Combines connection status (SSE) and pause state. Paused dot uses
  // the yellow paused style; disconnected falls back to red. Connected
  // (the default) is green.
  const status = connectionStatus.value
  const isPaused = paused.value
  const cls =
    'status-dot' +
    (isPaused ? ' paused' : '') +
    (status === 'disconnected' ? ' disconnected' : '')
  const title = isPaused
    ? 'Paused'
    : status === 'connected'
      ? 'Connected'
      : status === 'disconnected'
        ? 'Disconnected — retrying...'
        : 'Connecting…'
  return <div class={cls} id="statusDot" title={title} />
}

export function Header() {
  return (
    <div class="header">
      <div class="header-title">
        <div class="logo">
          <StorybookLogo />
        </div>
        Telemetry Debugger
        <StatusDot />
      </div>
      <ViewToggle />
      <div class="controls">
        <SearchBox />
        <PauseButton />
        <AutoScrollButton />
        <ExpandButton />
        <div class="separator" />
        <ExportMenu />
        <ClearButton />
        <EventCounter />
      </div>
    </div>
  )
}
