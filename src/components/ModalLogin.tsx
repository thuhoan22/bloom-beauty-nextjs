"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getDeviceInfo } from "@/utils/device";
import toast from 'react-hot-toast';
import ModalConfirm from './ModalConfirm';

import "./Modal.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalLogin({ isOpen, onClose } : Props) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingLogin, setPendingLogin] = useState<null | {
    user: any;
    session: any;
  }>(null);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setErrorMsg(""); // reset trước
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // toast.error(error.message);
      setErrorMsg("Incorrect email or password");
      return;
    }

    const user = data.user;

    // check session
    const { data: sessions } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if ((sessions?.length ?? 0) >= 1) {
      // lưu tạm login
      setPendingLogin({
        user,
        session: data.session,
      });

      // logout tạm
      await supabase.auth.signOut();

      // mở popup confirm
      setShowConfirm(true);
      return;
    }

    // chưa vượt → lưu session luôn
    await saveSession(user.id, data.session.access_token);

    toast.success("Login success!");
    onClose();
  }

  const saveSession = async (userId: string, token: string) => {
    const { deviceName, deviceType, os } = getDeviceInfo();

    await supabase.from("user_sessions").insert({
      user_id: userId,
      session_token: token,
      device_name: deviceName,
      device_type: deviceType,
      os,
      is_active: true,
    });
  };

  const handleForceLogin = async () => {
    if (!pendingLogin) return;

    const { user, session } = pendingLogin;

    // lấy session cũ nhất
    const { data: sessions } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1);

    const oldest = sessions?.[0];

    if (oldest) {
      // xóa session cũ
      await supabase
        .from("user_sessions")
        .update({ is_active: false })
        .eq("id", oldest.id);
    }

    // login lại
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    // lưu session mới
    await saveSession(user.id, data.session.access_token);

    toast.success("Login success!");
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
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
              {errorMsg && (
                <div className='noti-box'>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.30794 0.600098C12.5646 0.600098 16.0163 4.05093 16.0163 8.30843C16.0163 12.5651 12.5646 16.0168 8.30794 16.0168C4.05044 16.0168 0.599609 12.5651 0.599609 8.30843C0.599609 4.05093 4.05044 0.600098 8.30794 0.600098Z" stroke="#E77373" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.30339 5.14526V8.82776" stroke="#E77373" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.30312 11.4718H8.31146" stroke="#E77373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <p className='text'>Incorrect email or password</p>
                </div>
              )}
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
      {showConfirm && (
        <ModalConfirm
          isOpen={true}
          textConfirm={
            <>
              You're logged in on two devices. <br />Log out of the old device?
            </>
          }
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => handleForceLogin()}
        />
      )}
    </>
  )
}
