/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const Axios = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_REST_API_ENDPOINT + '/api',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
// Change request data/error
const AUTH_TOKEN_KEY =
  import.meta.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'authToken';
Axios.interceptors.request.use((config) => {
  const cookies = Cookies.get(AUTH_TOKEN_KEY);
  let token = '';
  if (cookies) {
    token = JSON.parse(cookies)['token'];
  }
  // @ts-ignore
  config.headers = {
    ...config.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return config;
});

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403) ||
      (error.response && error.response.data.message === 'Unauthorized')
    ) {
      Cookies.remove(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

// Write any possible search params here.
interface SearchParamOptions {}

export class HttpClient {
  static async get<T>(
    url: string,
    params?: unknown,
    options?: AxiosRequestConfig<T>,
  ) {
    const response = await Axios.get<T>(url, { params, ...options });
    return response.data;
  }

  static async post<T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig<T>,
  ) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig<T>,
  ) {
    const response = await Axios.put<T>(url, data, options);
    return response.data;
  }

  static async patch<T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig<T>,
  ) {
    const response = await Axios.patch<T>(url, data, options);
    return response.data;
  }

  static async delete<T>(url: string, options?: AxiosRequestConfig<T>) {
    const response = await Axios.delete<T>(url, options);
    return response.data;
  }

  static formatSearchParams(params: Partial<SearchParamOptions>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .join(';');
  }

  static formatBooleanSearchParam(key: string, value: boolean) {
    return value ? `${key}:1` : `${key}:`;
  }
}

export function getFormErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.message;
  }
  return null;
}

export function getFieldErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.errors;
  }
  return null;
}
