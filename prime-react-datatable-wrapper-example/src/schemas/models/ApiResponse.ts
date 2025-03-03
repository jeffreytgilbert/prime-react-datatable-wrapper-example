export type ApiResponse = {
  success: boolean;
  data: ApiResponseData | ApiResponseData[] | string[];
  msg: string;
  error: string;
  error_code: string;
  sub_error_code?: string;
}

export type ApiResponseData = {
  [key: string]: string | object | Array<ApiResponseData>;
}