/**
 * Modal façade. Callers `await openSaveModal({...})` or
 * `openExplanationModal(title, text)` and the user's submit/cancel
 * resolves the promise. Internally the open functions write to the
 * `modal` signal (driving the Modal component) and stash the resolver;
 * `resolveModal(result)` flips the signal back to null and runs the
 * resolver with `result` (or null on cancel).
 */

import { modal, type SaveModalSpec, type ExplainModalSpec } from './signals'

export type SaveModalResult = { filename: string; explanation: string } | null

let pending: ((value: any) => void) | null = null

export function openSaveModal(opts: {
  kind: 'json' | 'html'
  defaultName: string
  extension: string
  withExplanation?: boolean
}): Promise<SaveModalResult> {
  return new Promise<SaveModalResult>((resolve) => {
    pending = resolve
    const spec: SaveModalSpec = {
      kind: 'save',
      title: opts.kind === 'html' ? 'Export HTML snapshot' : 'Export JSON',
      defaultName: opts.defaultName,
      extension: opts.extension,
      withExplanation: !!opts.withExplanation,
    }
    modal.value = spec
  })
}

export function openExplanationModal(title: string, text: string): Promise<null> {
  return new Promise<null>((resolve) => {
    pending = resolve
    const spec: ExplainModalSpec = {
      kind: 'explain',
      title: title || 'Snapshot explanation',
      text: text || '',
    }
    modal.value = spec
  })
}

/** Close the modal and resolve any pending promise with `result`. */
export function resolveModal(result: any): void {
  if (modal.value === null) return
  modal.value = null
  const r = pending
  pending = null
  if (r) r(result)
}
