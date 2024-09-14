import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default function authGuard(
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return (req: ApiRequest<undefined>, res: ApiResponse<any>) => {
    const { authorization } = req.headers;

    if (!authorization) {
      res
        .status(401)
        .json({ success: false, error: "Bearer token is required" });
      return;
    }

    const authParts = authorization.split(" ");
    const bearer = authParts[0];
    const token = authParts[1];

    if (bearer !== "Bearer" || !token) {
      res.status(401).json({ success: false, error: "Invalid bearer token" });
      return;
    }

    let user = null;
    jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
      if (decoded) {
        user = decoded;
      }
      if (err) {
        res.status(401).json({ success: false, error: "Token is invalid" });
      }
    });

    if (!user) {
      res
        .status(401)
        .json({ success: false, error: "User is not authenticated" });
      return;
    }

    return handler(req, res);
  };
}
