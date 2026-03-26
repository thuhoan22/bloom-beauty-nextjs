"use client";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { supabase } from "@/lib/supabase";

import "./AvatarUpload.scss";

interface AvatarUploadProps {
  userId: string;
  avatarUrl?: string;
  onUpload: (url: string) => void;
};

export default function AvatarUpload({ userId, avatarUrl, onUpload } : AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(avatarUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (avatarUrl) {
      setPreview(avatarUrl);
    }
  }, [avatarUrl]);

  const handleUpload = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0];
    if (!file) return;

    // reset input để chọn lại cùng file vẫn chạy
    target.value = "";

    // validate
    if (file.size > 2 * 1024 * 1024) {
      alert("Max 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image allowed");
      return;
    }

    try {
      setUploading(true);

      // preview ngay lập tức
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const fileExt = file.name.split(".").pop();
      const filePath = `avatar/${userId}/avatar.${fileExt}`;

      const { error } = await supabase.storage
        .from("assets")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) throw new Error("No URL");

      const publicUrl = data.publicUrl;
      console.log("Uploaded URL:", publicUrl);
      onUpload(publicUrl);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="avatar-box">
      <div className="thumbnail">
        <img
          src={preview || "/images/default-avatar.png"}
          alt="avatar"
        />

        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full text-white text-sm">
            Uploading...
          </div>
        )}
      </div>
      <div className="task">
        <button type="button" className="btn_edit" onClick={handleClickUpload}></button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{display: "none"}}
        />
      </div>
    </div>
  );
}