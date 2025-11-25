"use client"

import { useState } from "react"

export default function AccountPassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <h3 className="text-title">Change password</h3>
      <div className="info-main hidden-label">
        <ul className="info-list">
          <li className={`info-item input-parent ${showOldPassword ? "is-show" : ""}`}>
            <label htmlFor="old-password" className="label">Old Password</label>
            <input 
              type={showOldPassword ? "text" : "password"}
              id="old-password" 
              className="input" 
              placeholder="Old password" 
            />
            <span className="icon-eye" onClick={() => setShowOldPassword(prev => !prev)}></span>
          </li>
          <li className="info-item info-item-col">
            <div className={`col input-parent ${showNewPassword ? "is-show" : ""}`}>
              <label htmlFor="new-password" className="label">New Password</label>
              <input 
                type={showNewPassword ? "text" : "password"}
                id="new-password" 
                className="input" 
                placeholder="New password" 
              />
              <span className="icon-eye" onClick={() => setShowNewPassword(prev => !prev)}></span>
            </div>
            <div className={`col input-parent ${showConfirmPassword ? "is-show" : ""}`}>
              <label htmlFor="confirm-password" className="label">Confirm new password</label>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password" 
                className="input" 
                placeholder="Confirm new password" 
              />
              <span className="icon-eye" onClick={() => setShowConfirmPassword(prev => !prev)}></span>
            </div>
          </li>
        </ul>
        <button type="button" className="btn btn-secondary btn-save">Save</button>
      </div>
    </>
  )
}
