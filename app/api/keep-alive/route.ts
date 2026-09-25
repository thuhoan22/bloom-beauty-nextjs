// import { supabase } from "@/lib/supabase";

// export async function GET() {
//   const { error } = await supabase
//     .from("health_check")
//     .select("id") 
//     .limit(1);

//   return Response.json({
//     success: !error,
//     timestamp: new Date().toISOString(),
//   });
// }