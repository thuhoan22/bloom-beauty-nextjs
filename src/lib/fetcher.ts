const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};

export async function fetchAPI(endpoint: string) {
  const res = await fetch(`${BASE_URL}/rest/v1/${endpoint}`, {
    headers,
    cache: "no-store"
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("API ERROR:", data);
    throw new Error(data.message || "API error");
  }

  return data;
}