import { supabase } from "@/lib/supabase";

export const getProfile = async (userId?: string) => {
  let id = userId;
  if (!id) {
    const { data: userData } = await supabase.auth.getUser();
    id = userData.user?.id;
  }

  if (!id) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) console.log(error);
  return data;
};