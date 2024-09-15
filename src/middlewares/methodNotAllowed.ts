import { NextApiRequest, NextApiResponse } from "next";

type HandlerProps = {
  allowedMethods: string[];
};

const handler =
  (
    req: NextApiRequest,
    res: NextApiResponse,
    { allowedMethods }: HandlerProps
  ) =>
  async () => {
    const { method } = req;

    // only allowed specified methods
    if (!method || !allowedMethods.includes(method)) {
      res.status(405).json({ success: false, error: "Method not allowed" });
      return;
    }
  };

export default handler;
