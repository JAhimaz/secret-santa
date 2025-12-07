import { createClient } from "@/app/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .or(`group_creator.eq.${user.id},members.cs.{${user.id}}`);

  if (error) return Response.json({ error }, { status: 400 });
  if (!data) return Response.json({ groups: [] });

  const groupsWithGifts = await Promise.all(
    data.map(async (group) => {
      const { data: wishlistItems } = await supabase
        .from("wishlist_items")
        .select("id, user_creator, user_gifter")
        .eq("group_id", group.group_id)
        .eq("user_creator", user.id);

      const number_of_gifts = wishlistItems?.length ?? 0;

      return {
        ...group,
        gifts: {
          [user.id]: {
            number_of_gifts,
            // or gift_chosen: number_of_gifts > 0,
          },
        },
      };
    })
  );

  return Response.json({ groups: groupsWithGifts });
}
