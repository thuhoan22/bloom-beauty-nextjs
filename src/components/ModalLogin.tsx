"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

import "./Modal.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalLogin({ isOpen, onClose } : Props) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login success!");
      onClose();
    }
  }

  return (
    <div className="modal-wrap">
      <div className="modal">
        <div className="modal-head">
          <h2 className="modal-head-title">Login</h2>
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
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
