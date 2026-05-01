export function ModalShell() {
  return (
    <div class="modal-overlay" id="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title" id="modalTitle"></h3>
          <button type="button" class="modal-close" id="modalCloseBtn" aria-label="Close">
            ×
          </button>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-footer" id="modalFooter"></div>
      </div>
    </div>
  )
}
