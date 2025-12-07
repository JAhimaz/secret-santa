import { createClient } from "@/app/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { group_name, group_passkey, group_cutoff, members_max } = body;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return new Response("Unauthorized", { status: 401 });

  const hashedPass = await bcrypt.hash(group_passkey, 12);

  const { data, error } = await supabase
    .from("groups")
    .insert({
      group_name: group_name,
      group_creator: user.id,
      group_passkey: hashedPass,
      group_locked: false,
      group_cutoff: group_cutoff || null,
      members_curr_count: 1,
      members_max: members_max,
      members: [user.id],
    })
    .select("*")
    .single();

  if (error) return Response.json({ error }, { status: 400 });

  return Response.json({ group: data });
}
