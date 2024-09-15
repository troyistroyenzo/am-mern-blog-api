/**
 * Inspired from: https://medium.com/@abrar.adam.09/implementing-rate-limiting-in-next-js-api-routes-without-external-packages-7195ca4ef768
 */

import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: false;
  error: string;
};

const RATE_LIMIT_MAP = new Map();
const REQUEST_LIMIT = 5;
const REQUEST_WINDOW = 1000 * 60;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // get client ip
  const ip = req.headers["x-forwarded-for"];

  // if client is a first time user, then set initial
  if (!RATE_LIMIT_MAP.has(ip)) {
    RATE_LIMIT_MAP.set(ip, {
      count: 0,
      lastReset: Date.now(),
    });
  }

  const ipData = RATE_LIMIT_MAP.get(ip);

  // reset client access
  if (Date.now() - ipData.lastReset > REQUEST_WINDOW) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }

  // if hit the limit, throw an error
  if (ipData.count >= REQUEST_LIMIT) {
    return res.status(429).json({ success: false, error: "Are you a robot?" });
  }

  // keep count of client access
  ipData.count += 1;
};

export default handler;
