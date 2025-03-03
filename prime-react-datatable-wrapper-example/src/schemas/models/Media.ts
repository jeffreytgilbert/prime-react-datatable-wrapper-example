export type Media = {
  id: number;
  app_id: number;
  uuid: string;
  edits: string;
  ai_name: string;
  is_booth_shot: number;
  is_primary_shot: number;
  detail_of_id: number;
  // description: string; // @deprecated
  ai_category_id: number;
  ai_category_name: string;
  artist_id: number;
}
