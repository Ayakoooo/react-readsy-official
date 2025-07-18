export type UserType = {
  id: string;
  username: string;
  email: string;
  created_at: string;
};

export type FairyTaleType = {
  id: number;
  url: string;
  title: string;
  brief: string;
  content: string;
  created_at: string;
  image_url?: string;
};

export type CommentType = {
  id: number;
  post_id: number;
  user_id: string;
  username: string;
  content: string;
  parent_id?: number | null;
  created_at: string;
};

export type FavoriteType = {
  id: number;
  fairy_tales: FairyTaleType[];
  created_at: string;
};
