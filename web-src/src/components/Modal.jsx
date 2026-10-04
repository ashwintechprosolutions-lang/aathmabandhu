// Generic glassy popup used by the compact card grids (ComplaintListItem, officer
// tiles) to show full details on click. Backdrop click or the close button
// dismisses it; z-index sits above the drawer but below Alert, so a confirm
// alert triggered from inside a modal still shows on top of it.
import React from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button type="button" className="touchable modal-close" onClick={onClose} aria-label="Close">
            <IoClose size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
