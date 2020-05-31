import { Context } from "../api";

export function invoker<T>(cb: (ctx: Context, body: any) => Promise<T>) {
  return async function (req: any, res: any & { body: { data: T } }) {
    try {
      const ret = await cb(req.ctx, req.body);
      res.status(200).json({ data: ret });
    } catch (err) {
      res.status(400).send({ data: { error: err.message } });
    }
  };
}
