import { convertEnumToLabel, convertFieldsToNumbers, convertIdFieldsToNumbers } from "../../services/resolveApi";
import { ApiResponseData } from "./ApiResponse";

export type SearchableAdmin = {
  id: number;
  login: string;
  email_login: string;
  pass: string;
  first_name: string;
  last_name: string;
  type: number;
  typeLabel?: string;
  status: number;
  statusLabel?: string;
  sponsor_id: number;
  admin_key: string;
  sponsor_name: string;
  sponsor_address1: string;
  sponsor_address2: string;
  sponsor_city: string;
  sponsor_state_province: string;
  sponsor_postal_code: string;
  sponsor_country: string;
  sponsor_phone1: string;
  sponsor_phone2: string;
  sponsor_phone3: string;
  sponsor_fax: string;
  sponsor_email: string;
  sponsor_website: string;
};

export type FullAdmin = SearchableAdmin;

export function typecastSearchableAdminJSON(data: ApiResponseData){
  const typed = convertFieldsToNumbers(convertIdFieldsToNumbers(data),
    ['type', 'status']
  ) as SearchableAdmin;
  typed.typeLabel = convertEnumToLabel(data.type as string, {
    1: 'Super Admin',
    2: 'Event Admin',
    3: 'Data Entry',
    4: 'Marketing',
    20: 'Limited Admin',
  });
  typed.statusLabel = convertEnumToLabel(data.status as string, {
    0: 'Inactive',
    1: 'Active',
  });
  return typed;
}

export function typecastFullAdminJSON(data: ApiResponseData){
  return typecastSearchableAdminJSON(data) as FullAdmin;
}