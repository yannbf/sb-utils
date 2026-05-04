/**
 * Drop overlay — fades in while a file is being dragged over the window
 * and triggers the JSON import on drop. State lives in a local signal so
 * the rest of the app doesn't care about drag depth tracking. Inert in
 * snapshot mode (the import endpoint is no-oped there anyway).
 */

import { signal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { pushToast } from '../store/signals'

const dragActive = signal(false)

export function DropOverlay() {
  // Wire the global drag listeners once. The overlay's visibility is
  // driven by the local `dragActive` signal; reactivity flips the class.
  useEffect(() => {
    if ((window as any).__SNAPSHOT__) return // snapshot is read-only

    let depth = 0
    const isFileDrag = (e: DragEvent) =>
      !!e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')

    const onEnter = (e: DragEvent) => {
      if (!isFileDrag(e)) return
      depth++
      dragActive.value = true
    }
    const onOver = (e: DragEvent) => {
      if (!isFileDrag(e)) return
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    }
    const onLeave = (e: DragEvent) => {
      if (!isFileDrag(e)) return
      depth = Math.max(0, depth - 1)
      if (depth === 0) dragActive.value = false
    }
    const onDrop = async (e: DragEvent) => {
      if (!isFileDrag(e)) return
      e.preventDefault()
      depth = 0
      dragActive.value = false
      const file = e.dataTransfer?.files?.[0]
      if (!file) return
      if (!/\.json$/i.test(file.name) && file.type !== 'application/json') {
        pushToast('Only .json files are supported')
        return
      }
      let parsed: unknown
      try {
        parsed = JSON.parse(await file.text())
      } catch (err) {
        pushToast('Invalid JSON: ' + ((err as Error)?.message ?? 'parse error'))
        return
      }
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        !Array.isArray((parsed as { events?: unknown }).events)
      ) {
        pushToast('Expected a JSON object shaped like { events, explanation? }')
        return
      }
      try {
        const res = await fetch('/event-log/import?name=' + encodeURIComponent(file.name), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        })
        const data = await res.json()
        if (!res.ok) {
          pushToast('Import failed: ' + (data.error || res.statusText))
          return
        }
        pushToast('Imported ' + data.imported + ' events from ' + file.name)
      } catch (err) {
        pushToast('Import failed: ' + ((err as Error)?.message ?? 'network error'))
      }
    }

    window.addEventListener('dragenter', onEnter)
    window.addEventListener('dragover', onOver)
    window.addEventListener('dragleave', onLeave)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragenter', onEnter)
      window.removeEventListener('dragover', onOver)
      window.removeEventListener('dragleave', onLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [])

  return (
    <div class={'drop-overlay' + (dragActive.value ? ' active' : '')} id="dropOverlay">
      <div class="drop-card">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <h3>Drop a JSON file to import events</h3>
        <p>Accepts arrays exported from this dashboard</p>
      </div>
    </div>
  )
}
