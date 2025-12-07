import { createClient } from "@/app/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // generate a 24 key invite, it should be unique, it checks the db for existing keys
  const generateInviteKey = async (): Promise<string> => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let inviteKey = "";
    for (let i = 0; i < 24; i++) {
      inviteKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return inviteKey;
  };

  let newInviteKey = "";

  while(true) {
    newInviteKey = await generateInviteKey();
    const { data: existing } = await supabase
      .from("groups")
      .select("group_invite")
      .eq("group_invite", newInviteKey)
      .maybeSingle();
    if (!existing) {
      break;
    }
  }

  // Update group with new invite key
  const { data: updatedGroup, error } = await supabase
    .from("groups")
    .update({ group_invite: newInviteKey })
    .eq("group_id", id)
    .select()
    .maybeSingle();
  if (error) return Response.json({ error }, { status: 400 });

  return Response.json({ invite_link: updatedGroup?.group_invite });  
}