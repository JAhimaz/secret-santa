import { createClient } from "@/app/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response("Unauthorized", { status: 401 });

  // Fetch group if user is member or creator
  const { data: group, error } = await supabase
    .from("groups")
    .select("*")
    .eq("group_id", id)
    .or(`group_creator.eq.${user.id},members.cs.{${user.id}}`)
    .maybeSingle();

  if (error) return Response.json({ error }, { status: 400 });
  if (!group) return new Response("Group not found", { status: 404 });

  // Count wishlist items created by this user
  const { data: wishlistItems } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("group_id", group.group_id)
    .eq("user_creator", user.id);

  const number_of_gifts = wishlistItems?.length ?? 0;

  // Fetch additional user info from your `public.users` table
  const { data: userDetails } = await supabase
    .from("users")
    .select("name")
    .eq("uuid", user.id)
    .maybeSingle();

  const memberDetails = {
    [user.id]: {
      name: userDetails?.name ?? null,
      email: user.email,
      number_of_gifts,
    },
  };

  const groupWithMemberDetails = {
    ...group,
    memberDetails,
  };

  return Response.json({ group: groupWithMemberDetails });
}
