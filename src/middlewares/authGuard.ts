import { NextApiRequest, NextApiResponse } from "next";

import { verifyToken } from "@/lib/auth";

export type Data = {
  success: false;
  error: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res
      .status(401)
      .json({ success: false, error: "`Authorization` header is required" });
    return;
  }

  const authParts = authorization.split(" ");
  const bearer = authParts[0];
  const token = authParts[1];

  if (bearer !== "Bearer" || !token) {
    res.status(401).json({ success: false, error: "Invalid token format" });
    return;
  }

  try {
    verifyToken(token);
  } catch (error) {
    res
      .status(401)
      .json({ success: false, error: "Token is invalid or expired" });
    return;
  }
};

export default handler;
