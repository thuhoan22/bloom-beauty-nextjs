"use client";

interface Props {
  isOpen: boolean;
  textConfirm: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ModalConfirm({ isOpen, textConfirm, onCancel, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-wrap">
      <div className="modal modal-confirm">
        <div className="modal-head">
          {/* <p className="modal-head-title">Are you sure <br/>you want to log out?</p> */}
          <p className="modal-head-title">{textConfirm}</p>
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