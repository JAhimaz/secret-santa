export type Group = {
  id: number;
  group_id: string;
  group_name: string;
  group_creator: string;
  group_passkey: string;
  group_locked: boolean;
  group_cutoff?: string;
  group_invite?: string;
  members_curr_count: number;
  members_max: number;
  memberDetails: {
    [userId: string]: {
      name: string | null;
      email: string;
      number_of_gifts: number;
    }
  }
  members: string[] | null;
  created_at: string;
}

export type WishlistItem = {
  id: number;
  group_id: number | null;
  item_name: string;
  item_quantity: number;
  item_description: string | null;
  item_url: string | null;
  user_gifter: string | null;
  user_creator: string;
  created_at: string;
  item_price: number;
}