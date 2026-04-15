"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function AccountPassword() {
  const router = useRouter(); 
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if(!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if(newPassword !== confirmPassword) {
      setError("Password do not match");
      return;
    }

    try {
      setLoading(true);

      // lay email user hien tai
      const { data: { user }} = await supabase.auth.getUser();

      if(!user?.email) {
        setError("User not found");
        return;
      }

      // Re-login de verify old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if(signInError) {
        setError("Old password is incorrect");
        return;
      }

      // Update password
      const { error: updateError  } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if(updateError ) {
        setError(updateError .message);
        return;
      }

      // reset value
      const resetForm = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      };

      // setSuccess("Password update successfully");
      toast.success("Password updated successfully");

      setTimeout(() => {
        // window.location.reload(); // hoặc router.refresh()
        resetForm();
        router.refresh();
      }, 600);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="panel-head">
        <h3 className="text-title">Change password</h3>
      </div>
      <div className="panel-info hidden-label">
        {error && (
          <div className='noti-box'>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.30794 0.600098C12.5646 0.600098 16.0163 4.05093 16.0163 8.30843C16.0163 12.5651 12.5646 16.0168 8.30794 16.0168C4.05044 16.0168 0.599609 12.5651 0.599609 8.30843C0.599609 4.05093 4.05044 0.600098 8.30794 0.600098Z" stroke="#E77373" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.30339 5.14526V8.82776" stroke="#E77373" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.30312 11.4718H8.31146" stroke="#E77373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p className='text'>{error}</p>
          </div>
        )}
        <ul className="info-list form-list">
          <li className={`info-item input-parent ${showOldPassword ? "is-show" : ""}`}>
            <label htmlFor="old-password" className="label">Old Password</label>
            <input 
              type={showOldPassword ? "text" : "password"}
              id="old-password" 
              className="input" 
              placeholder="Old password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <span className="icon-eye" onClick={() => setShowOldPassword(prev => !prev)}></span>
            {/* {error && <p className="text-error">{error}</p>} */}
          </li>
          <li className="info-item info-item-col">
            <div className={`col input-parent ${showNewPassword ? "is-show" : ""}`}>
              <label htmlFor="new-password" className="label">New Password</label>
              <input 
                type={showNewPassword ? "text" : "password"}
                id="new-password" 
                className="input" 
                placeholder="New password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="icon-eye" onClick={() => setShowConfirmPassword(prev => !prev)}></span>
            </div>
          </li>
        </ul>
        <button 
          type="button" 
          className="btn btn-secondary btn-save"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  )
}
