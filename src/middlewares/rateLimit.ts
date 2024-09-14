import { NextApiRequest, NextApiResponse } from "next";

const rateLimitMap = new Map();

export default function rateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return (req: ApiRequest<undefined>, res: ApiResponse<any>) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const limit = 5;
    const windowMs = 5 * 1000;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      });
    }

    const ipData = rateLimitMap.get(ip);

    if (Date.now() - ipData.lastReset > windowMs) {
      ipData.count = 0;
      ipData.lastReset = Date.now();
    }

    if (ipData.count >= limit) {
      return res
        .status(429)
        .json({ success: false, error: "Are you a robot?" });
    }

    ipData.count += 1;

    return handler(req, res);
  };
}
