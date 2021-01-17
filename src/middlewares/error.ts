import { Request, Response, NextFunction as Next } from "express";

export default async (
  error: Error,
  req: Request,
  res: Response,
  next: Next
) => {
  console.error(error);

  return res.status(500).send({
    error: "internal_error",
    error_description: error.message,
  });
};
