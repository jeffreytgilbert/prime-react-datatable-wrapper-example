export type SelectOption = {
  value: string;
  label: string;
}

export type ArtImageTypeOptions = {
  id: string;
  description: string;
  is_shown_by_default: string;
  is_booth_shot: string;
  is_billable: string;
  is_primary_splittable: string;
  detail_of_ai_type: string;
  is_app_cat_different: string;
  shown_when_cat_id_in_list?: string;
} & SelectOption;
