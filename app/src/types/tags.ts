export type TagColor =
  | "sage"
  | "terracotta"
  | "blue"
  | "yellow"
  | "purple"
  | "orange"
  | "teal"
  | "pink";

export interface JobTag {
  id: string;
  user_id: string;
  name: string;
  color: TagColor;
  created_at: string;
  updated_at: string;
}
