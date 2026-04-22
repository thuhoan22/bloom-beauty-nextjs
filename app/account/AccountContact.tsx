"use client";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/profile.api";
import { supabase } from "@/lib/supabase";
import AvatarUpload from "@/components/AvatarUpload";

export interface Profile {
  name: string;
  email: string;
  address: string;
  phone: string;
  avatar: string;
};

type Props = {
  cachedProfile?: Profile | null;
  cachedUserId?: string;
  onCacheProfile?: (profile: Profile) => void;
  onCacheUserId?: (userId: string) => void;
};

export default function AccountContact({
  cachedProfile,
  cachedUserId,
  onCacheProfile,
  onCacheUserId,
}: Props) {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const [userId, setUserId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (cachedUserId) setUserId(cachedUserId);
    if (cachedProfile) {
      setProfile(cachedProfile);
      setLoadingProfile(false);
    }
  }, [cachedProfile, cachedUserId]);

  useEffect(() => {
    const load = async () => {
      if (cachedProfile && cachedUserId) return;

      // getSession thường nhanh (lấy từ local storage), fallback sang getUser
      const { data: sessionData } = await supabase.auth.getSession();
      let user = sessionData.session?.user ?? null;
      if (!user) {
        const { data: userData } = await supabase.auth.getUser();
        user = userData.user ?? null;
      }

      if (user) {
        setUserId(user.id);
        onCacheUserId?.(user.id);
        const data = await getProfile(user.id);
        if (data) {
          setProfile(data);
          onCacheProfile?.(data);
        }
      }

      setLoadingProfile(false);
    };

    load();
  }, [cachedProfile, cachedUserId, onCacheProfile, onCacheUserId]);

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...profile, [target.name]: target.value };
    setProfile(next);
    onCacheProfile?.(next);
  };

  const handleAvatarUpload = async (url: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("profiles")
      .update({ avatar: url })
      .eq("id", userId);

    if (error) {
      console.log(error);
      return;
    }

    setProfile((prev) => {
      const next = { ...prev, avatar: url };
      onCacheProfile?.(next);
      return next;
    });
  };

  const handleSave = async () => {
    if (!userId) return;

    console.log("Saving start...");

    setSaving(true);

    try {
      const { name, address, phone, avatar } = profile;

      const { data, error } = await supabase
        .from("profiles")
        .update({ name, address, phone, avatar })
        .eq("id", userId)
        .select();

      console.log("Response:", data, error);

      if (error) {
        console.log("Update error:", error);
        alert("Save failed!");
        return;
      }

      // refresh cache from DB after save
      const fresh = await getProfile(userId);
      if (fresh) {
        setProfile(fresh);
        onCacheProfile?.(fresh);
      }

      alert("Saved!");
    } catch (err) {
      console.log("Catch error:", err);
    } finally {
      setSaving(false);
      console.log("Saving end");
    }
  };

  return (
    <>
      <div className="panel-head">
        <h3 className="text-title">Contact information</h3>
      </div>
      <div className="panel-info">
        {/* {loadingProfile && <p className="text-base">Loading profile...</p>} */}
        <ul className="info-list form-list">
          <li className="info-item info-item-col">
            <div className="col">
              <label htmlFor="mail" className="label">Email</label>
              <input 
                type="text" 
                id="mail" 
                name="mail"
                className="input" 
                value={profile.email}
                placeholder="Email"
                disabled 
              />
            </div>
            <div className="col">
              <label htmlFor="name" className="label">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                className="input" 
                value={profile.name}
                placeholder="Name"
                onChange={handleChange}
                disabled={loadingProfile}
              />
            </div>
          </li>
          <li className="info-item info-item-col">
            <div className="col">
              <label htmlFor="address" className="label">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address"
                className="input" 
                value={profile.address}
                placeholder="Address"
                onChange={handleChange}
                disabled={loadingProfile}
              />
            </div>
            <div className="col">
              <label htmlFor="phone" className="label">Phone</label>
              <input 
                type="text" 
                id="phone" 
                name="phone"
                className="input" 
                value={profile.phone}
                placeholder="Phone" 
                onChange={handleChange}
                disabled={loadingProfile}
              />
            </div>
          </li>
          <li className="info-item">
            <span className="label">Avatar</span>
            <AvatarUpload
              userId={userId}
              avatarUrl={profile.avatar}
              onUpload={handleAvatarUpload}
            />
          </li>
        </ul>
        <button 
          type="button" 
          className="btn btn-secondary btn-save" 
          onClick={handleSave}
          disabled={saving || loadingProfile}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  )
}
