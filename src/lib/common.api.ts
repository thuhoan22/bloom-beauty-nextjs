import { getAuthUser } from "./supabase";

export const getUser = async () => {
  return await getAuthUser();
};