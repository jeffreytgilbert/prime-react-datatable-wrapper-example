import toast from "react-hot-toast";
import { ApiResponse, ApiResponseData } from "../schemas/models/ApiResponse";
import { FormErrors } from "@mantine/form";
import { formatDate } from "../components/DataTable/FormatDate";

enum XHRFailureCodes {
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  UNAUTHORIZED_ACTION = 'UNAUTHORIZED_ACTION',
  FORM_VALIDATION_FAILED = 'FORM_VALIDATION_FAILED',
  MISSING_REQUIRED_PARAMETERS = 'MISSING_REQUIRED_PARAMETERS',
  NO_RESULTS_FOUND = 'NO_RESULTS_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  ACTION_FAILED = 'ACTION_FAILED',
}

enum XHRSubErrorCodes {
  AUTH_ERROR_NO_ACCOUNT_FOUND_FOR_EMAIL = 'AUTH_ERROR_NO_ACCOUNT_FOUND_FOR_EMAIL',
}

type ErrorResponse = {
  success: false;
  error_code: string;
  error: string;
  msg: string;
  data: string[];
};
interface Message {
  when: Date;
  notification: string;
}
function ToastDisplayError(apiMsg: string, customMsg: string = '') {
  // if(api.success === true) return;
  const messages: Message[] = [];
  const handleToastError = (errorMsg: string) => {
    messages.push({notification: errorMsg, when: new Date()});
    const foundNotices = messages.filter((m) => m.notification ===  apiMsg);
    foundNotices.map((f, index) => toast.error(
      formatDate(
        f.when
      ) + '\nServer: ' +  f.notification + '\n' + customMsg,
      {
        id: `${index}`,
        duration: 5000,
      }
    ));
  }
  handleToastError(apiMsg);
}

function ToastDisplayWarning(apiMsg: string, customMsg: string = '') {
  // if(api.success === true) return;
  const messages: Message[] = [];
  const handleMessageError = (errorMsg: string) => {
    messages.push({notification: errorMsg, when: new Date()});
    const foundNotices = messages.filter((m) => m.notification ===  apiMsg);
    foundNotices.map((f, index) => toast(
      formatDate(
        f.when
      ) + '\nServer: ' +  f.notification + '\n' + customMsg,
      {
        id: `${index}`,
        duration: 5000,
      }
    ));
  }
  handleMessageError(apiMsg);
}

function ToastDisplaySuccess(apiMsg: string, customMsg: string = '') {
  // if(api.success === true) return;
  const messages: Message[] = [];
  const handleToastSuccess = (errorMsg: string) => {
    messages.push({notification: errorMsg, when: new Date()});
    const foundNotices = messages.filter((m) => m.notification ===  apiMsg);
    foundNotices.map((f, index) => toast.success(
      formatDate(
        f.when
      ) + '\nServer: ' +  f.notification + '\n' + customMsg,
      {
        id: `${index}`,
        duration: 5000,
      }
    ));
  }
  handleToastSuccess(apiMsg);
}


// TODO - find a way in mantine to highlight the field that failed validation, and focus on the first one that failed.
// If that method needs to be passed into this call, then we can pass it in as a parameter.
function checkFormValidationError(api: ApiResponse, form?: GenericForm) {
  if (api.success === false) {
    const apiError = api as ErrorResponse;
    if(apiError.error_code === XHRFailureCodes.FORM_VALIDATION_FAILED){
      apiError.data.forEach((field: string) => {
        console.error('field', field);
      });
      const networkError = apiError.data

      if (networkError.length > 0) {
        const input = networkError[0];
        if(form){
          const el = form.getInputNode(input);
          el?.focus();
        }
        ToastDisplayError(api.msg, `Please correct the errors in the form. starting with ${networkError[0]}`);
      }
    }
  }
  return api;
}

function checkMissingRequiredParameters(api: ApiResponse){
  if(api.success === false){
    if(api.error_code === XHRFailureCodes.MISSING_REQUIRED_PARAMETERS){
      ToastDisplayError(api.msg);
    }
  }
  return api;
}

function checkActionFailed(api: ApiResponse){
  if(api.success === false){
    if(api.error_code === XHRFailureCodes.ACTION_FAILED){
      // Use Toast to display the error message
      ToastDisplayWarning(api.msg);
    }
  }
  return api;
}

function checkAuthenticationRequired(api: ApiResponse, unsetAdmin: () => void){
  if(api.success === false){
    if(api.error_code === XHRFailureCodes.AUTHENTICATION_REQUIRED){
      if(api.sub_error_code === XHRSubErrorCodes.AUTH_ERROR_NO_ACCOUNT_FOUND_FOR_EMAIL){
        if(location.pathname !== '/onboarding'){
          location.href = '/onboarding';
        }
      }
      else {
        ToastDisplayError(api.msg)
        if(unsetAdmin) {
          unsetAdmin();
        }
      }
    }
  }
  return api;
}

function checkUnauthorizedAction(api: ApiResponse){
  if(api.success === false){
    if(api.error_code === XHRFailureCodes.UNAUTHORIZED_ACTION){
      ToastDisplayError(api.msg);
    }
  }
  return api;
}

function checkNoResultsFound(api: ApiResponse){
  if(api.success === false){
    if(api.error_code === XHRFailureCodes.NO_RESULTS_FOUND){
      ToastDisplayError(api.msg);
    }
  }
  return api;
}

function checkRateLimitExceeded(api: ApiResponse){
  if(api.success === false){
    if(api.error_code === XHRFailureCodes.RATE_LIMIT_EXCEEDED){
      ToastDisplayError(api.msg);
    }
  }
  return api;
}

function checkUnknownError(api: ApiResponse){
  if(api.success === false){
    if(api.error_code === XHRFailureCodes.UNKNOWN_ERROR){
      ToastDisplayError(api.msg);
    }
  }
  return api;
}

async function getApi(url: string, token?: string): Promise<ApiResponse>{
  const response = await fetch(url, !token ? {
    method: 'GET',
    credentials: 'include',
  }:{
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  const api: ApiResponse = await response.json();
  return api;
}

async function postApi(url:string, formData: URLSearchParams | FormData, token?: string): Promise<ApiResponse>{
  const urlSearchParams = new URLSearchParams();
  for (const pair of formData.entries()) {
    urlSearchParams.append(pair[0], pair[1] as string);
  }
  const response = await fetch(url, !token ? {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: urlSearchParams.toString(),
    credentials: 'include',
  } : {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`,
    },
    body: urlSearchParams.toString(),
    credentials: 'include',
  });
  const api = await response.json();
  if(api.success === false){
    // Form validation failed could trigger a focus action on the form field that failed
    if(api.error_code === XHRFailureCodes.FORM_VALIDATION_FAILED){
      console.log('FORM_VALIDATION_FAILED');
      if(typeof api.data !== 'undefined'){
        api.data.forEach((field: string) => {
          console.log('field', field);
          // TODO: set focus on the field
        });
      }
    }
  }
  return api;
}

const convertIdFieldsToNumbers = (data: ApiResponseData): Record<string, unknown> => {
  const newData: Record<string, unknown> = {};
  for (const key in data){
    if((key.endsWith('_id') || key === 'id') && data[key] !== null && !Number.isNaN(data[key])){
      newData[key] = Number(data[key]);
    }
    else {
      newData[key] = data[key];
    }
  }
  return newData;
}

const convertFieldsToNumbers = (data: Record<string, string | unknown>, fields: string[]): Record<string, unknown> => {
  const newData: Record<string, unknown> = {};
  for (const key in data){
    if(fields.includes(key) && data[key] !== null && !Number.isNaN(data[key])){
      newData[key] = Number(data[key]);
    }
    else {
      newData[key] = data[key];
    }
  }
  return newData;
}

const convertFieldsToNullableNumbers = (data: Record<string, string | unknown>, fields: string[]): Record<string, unknown> => {
  const newData: Record<string, unknown> = {};
  for (const key in data){
    if(fields.includes(key) && data[key] !== null && !Number.isNaN(data[key])){
      if(data[key] === ''){
        newData[key] = null;
      }
      else {
        newData[key] = Number(data[key]);
      }
    }
    else {
      newData[key] = data[key];
    }
  }
  return newData;
}

function convertMysqlDatetimeToNullableJsDate(mysqlDatetime: string): Date | null {
  if(!mysqlDatetime) return null;
  if(mysqlDatetime === '0000-00-00 00:00:00') return null;
  if(mysqlDatetime === '0000-00-00') return null;
  if(mysqlDatetime === '00:00:00') return null;
  const dateString = mysqlDatetime.replace(/-/g, "/");
  return new Date(dateString);
}

function convertEnumToLabel(enumValue: string, enumType: Record<string, string>): string {
  return enumType[enumValue];
}

function noTokenError(){
  toast.error(
    'We cannot process your request at this time. Please refresh the page try again.',
    {
      duration: 5000,
    }
  );
}

function checkFetchError(api: ApiResponse, unsetAdmin: () => void){
  checkAuthenticationRequired(api, unsetAdmin);
  checkUnauthorizedAction(api);
  checkMissingRequiredParameters(api);
  checkNoResultsFound(api);
  checkRateLimitExceeded(api);
  checkUnknownError(api);
  return api;
}

type LooseKeys<Values> = keyof Values | (string & {});
type GenericForm = {
  getInputNode: <NodeType extends HTMLElement, Field extends LooseKeys<unknown>>(path: Field) => NodeType | null
}

// Use Toast to display the error message
function checkFormSubmissionError(api: ApiResponse, unsetAdmin: () => void, form?: GenericForm){
  checkAuthenticationRequired(api, unsetAdmin);
  checkUnauthorizedAction(api);
  checkFormValidationError(api, form);
  checkMissingRequiredParameters(api);
  checkActionFailed(api);
  checkNoResultsFound(api);
  checkRateLimitExceeded(api);
  checkUnknownError(api);
  return api;
}

function zodFormValidationErrorHandler (errors: FormErrors) {
  for(const [field, message] of Object.entries(errors)){
    console.error("Validation Errors: ", field, message);
    toast.error(
      'Form Error: ' + message + '\n\n Field: ' + field,
      {
        duration: 5000,
      }
    );
  }
}

export {
  getApi,
  postApi,
  checkFetchError,
  checkFormSubmissionError,
  checkAuthenticationRequired,
  checkUnauthorizedAction,
  checkMissingRequiredParameters,
  checkNoResultsFound,
  checkRateLimitExceeded,
  checkUnknownError,
  checkActionFailed,
  checkFormValidationError,
  ToastDisplayError,
  ToastDisplayWarning,
  ToastDisplaySuccess,
  convertIdFieldsToNumbers,
  convertFieldsToNumbers,
  convertFieldsToNullableNumbers,
  convertMysqlDatetimeToNullableJsDate,
  convertEnumToLabel,
  XHRFailureCodes,
  XHRSubErrorCodes,
  zodFormValidationErrorHandler,
  noTokenError,
};
