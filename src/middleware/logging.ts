import { Request, Response, NextFunction } from "express";

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} Request to ${req.path}`);

  // testing;
  console.log(`Response status: ${res.statusCode}`);
  next();
};

export default { logRequest };
