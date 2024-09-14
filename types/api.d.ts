import { NextApiRequest, NextApiResponse } from "next";

interface ApiData<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ApiPagination {
  limit: number;
  page: number;
}

declare global {
  interface ApiRequest<T> extends NextApiRequest {
    body: T;
  }
  interface ApiResponse<T> extends NextApiResponse<ApiData<T>> {}
}
