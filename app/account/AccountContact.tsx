"use client";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/profile.api";
import { supabase } from "@/lib/supabase";
import AvatarUpload from "@/components/AvatarUpload";

interface Profile {
  name: string;
  email: string;
  address: string;
  phone: string;
  avatar: string;
};

export default function AccountContact() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const [userId, setUserId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (user) {
        setUserId(user.id);
        const data = await getProfile();
        if (data) setProfile(data);
      }
    };

    load();
  }, []);

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [target.name]: target.value });
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

    setProfile((prev) => ({ ...prev, avatar: url }));
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
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  )
}
