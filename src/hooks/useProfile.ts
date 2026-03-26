"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getProfile } from "@/lib/profile.api"; 

export const useProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    const data = await getProfile();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();

    // lắng nghe login / logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadProfile(); // login → load lại profile
        } else {
          setProfile(null); // logout → clear
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { profile, loading };
};