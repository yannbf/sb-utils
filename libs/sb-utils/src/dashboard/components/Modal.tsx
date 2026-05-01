/**
 * Single Modal component handling both modes the dashboard needs:
 *
 * - 'save': filename input with optional explanation textarea (used by JSON
 *   and HTML exports). Resolves with { filename, explanation } on submit.
 * - 'explain': read-only display of a baked snapshot explanation. Resolves
 *   with null on close.
 *
 * Callers use `openSaveModal()` / `openExplanationModal()` from
 * `store/modal.ts` and `await` the returned promise. The modal renders
 * conditionally based on the `modal` signal.
 */

import { useEffect, useRef } from 'preact/hooks'
import { modal } from '../store/signals'
import { resolveModal } from '../store/modal'

const stripExt = (name: string, ext: string) => {
  const suffix = '.' + ext
  return name.endsWith(suffix) ? name.slice(0, -suffix.length) : name
}

const appendExt = (name: string, ext: string): string | null => {
  const trimmed = (name || '').trim()
  if (!trimmed) return null
  const suffix = '.' + ext
  return trimmed.endsWith(suffix) ? trimmed : trimmed + suffix
}

export function Modal() {
  const spec = modal.value
  const overlayRef = useRef<HTMLDivElement>(null)

  // Esc-to-close + click-outside-to-close — installed only while the modal
  // is open. Cleanup on close. The body's auto-focus runs after the modal
  // mounts (Preact ref is filled by then).
  useEffect(() => {
    if (!spec) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resolveModal(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [spec])

  if (!spec) {
    return (
      <div
        class="modal-overlay"
        id="modalOverlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      />
    )
  }

  const onOverlayClick = (e: MouseEvent) => {
    if (e.target === overlayRef.current) resolveModal(null)
  }

  return (
    <div
      class="modal-overlay active"
      id="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      ref={overlayRef}
      onClick={onOverlayClick}
    >
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title" id="modalTitle">
            {spec.title}
          </h3>
          <button
            type="button"
            class="modal-close"
            id="modalCloseBtn"
            aria-label="Close"
            onClick={() => resolveModal(null)}
          >
            ×
          </button>
        </div>
        {spec.kind === 'save' ? <SaveBody spec={spec} /> : <ExplainBody spec={spec} />}
      </div>
    </div>
  )
}

function SaveBody({ spec }: { spec: import('../store/signals').SaveModalSpec }) {
  const nameRef = useRef<HTMLInputElement>(null)
  const explanationRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus the filename input and select the base name (no extension)
  // so the user can start typing immediately.
  useEffect(() => {
    const el = nameRef.current
    if (!el) return
    el.value = stripExt(spec.defaultName, spec.extension)
    el.focus()
    el.select()
  }, [spec])

  const submit = () => {
    const raw = nameRef.current?.value ?? ''
    const filename = appendExt(raw, spec.extension)
    if (!filename) {
      nameRef.current?.focus()
      return
    }
    const explanation = explanationRef.current?.value.trim() ?? ''
    resolveModal({ filename, explanation })
  }

  return (
    <>
      <div class="modal-body" id="modalBody">
        <div class="modal-field">
          <label for="modalFilenameInput">File name</label>
          <div class="modal-input-wrap">
            <input
              type="text"
              id="modalFilenameInput"
              spellcheck={false}
              autocomplete="off"
              ref={nameRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit()
                }
              }}
            />
          </div>
        </div>
        {spec.withExplanation && (
          <div class="modal-field">
            <label for="modalExplanationInput">
              Explanation{' '}
              <span class="hint">(optional — describe what this telemetry run was about)</span>
            </label>
            <textarea
              id="modalExplanationInput"
              class="modal-textarea"
              placeholder="e.g. Reproduced the duplicate boot-event regression after running `storybook dev` twice."
              ref={explanationRef}
            />
          </div>
        )}
      </div>
      <div class="modal-footer" id="modalFooter">
        <button
          type="button"
          class="modal-btn"
          id="modalCancelBtn"
          onClick={() => resolveModal(null)}
        >
          Cancel
        </button>
        <button type="button" class="modal-btn primary" id="modalSubmitBtn" onClick={submit}>
          Save
        </button>
      </div>
    </>
  )
}

function ExplainBody({ spec }: { spec: import('../store/signals').ExplainModalSpec }) {
  return (
    <>
      <div class="modal-body" id="modalBody">
        <div class="modal-explanation-view">{spec.text || ''}</div>
      </div>
      <div class="modal-footer" id="modalFooter">
        <button
          type="button"
          class="modal-btn primary"
          id="modalCloseActionBtn"
          onClick={() => resolveModal(null)}
        >
          Close
        </button>
      </div>
    </>
  )
}
