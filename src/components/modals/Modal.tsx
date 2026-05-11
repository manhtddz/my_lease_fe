import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({ isOpen, title, onClose, children, footer }: Props) {
  if (!isOpen) return null

  return createPortal(
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dw-modal-title"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="dw-modal-title">
                {title}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Đóng"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">{children}</div>
            {footer ? <div className="modal-footer">{footer}</div> : null}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>,
    document.body,
  )
}
