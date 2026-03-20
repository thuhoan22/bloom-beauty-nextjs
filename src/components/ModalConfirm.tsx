"use client";

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalConfirm({ isOpen, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-wrap">
      <div className="modal modal-confirm">
        <div className="modal-head">
          <p className="modal-head-title">Are you sure <br/>you want to log out?</p>
        </div>
        <div className="modal-footer">
          <div className="btn-group">
            <button className="btn btn-primary" onClick={onCancel}>Cancel</button>
            <button className="btn btn-secondary" onClick={onConfirm}>Yes</button>
          </div>
        </div>
      </div>
    </div>
  );
}