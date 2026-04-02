"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from 'react-hot-toast';

interface SignupProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function ModalSignup({ onClose, onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      console.log('Signup: ', data, error);

      if(error) {
        toast.error(error.message);
        return;
      }

      toast.success("Check your email to verify account");
      onSwitchToLogin();
      
    } catch (err) {
      console.error(err);
      toast.error("Signup failed!");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="modal-wrap">
      <div className="modal">
        <div className="modal-head">
          <h2 className="modal-head-title">Sign Up</h2>
          <span className="modal-head-desc">Please enter your e-mail and password:</span>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          >
            <span className="blind">Close</span>
          </button>
        </div>
        <div className="modal-content">
          <div className="modal-content-form">
            <div className="input-box">
              <input
                type="email"
                autoComplete="one-time-code"
                placeholder="Please enter email"
                className="input input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={`input-box ${showOldPassword ? "is-show" : ""}`}>
              <input
                type={showOldPassword ? "text" : "password"}
                name="login-password"
                autoComplete="one-time-code"
                placeholder="Please enter password"
                className="input input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="icon-eye" onClick={() => setShowOldPassword(prev => !prev)}></span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-login"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
