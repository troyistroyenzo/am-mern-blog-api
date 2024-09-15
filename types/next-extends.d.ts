import { NextApiRequest } from "next";

declare module "next" {
  export interface NextApiRequestWithBody<T> extends NextApiRequest {
    body: T;
  }
}
