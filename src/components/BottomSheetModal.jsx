import React from 'react';
import './css/BottomSheetModal.css';

function BottomSheetModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div
        className="bottom-sheet-content"
        onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
      >
        {children}
      </div>
    </div>
  );
}

export default BottomSheetModal;
