import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return; // STOP HERE
  }

  const token = authHeader.split(" ")[1];

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "JWT_SECRET is not set in .env" });
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err || !decoded) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // Type-safe decoding
    const payload = decoded as JwtPayload; // Type assertion

    // attach userId to request (must extend Request interface)
    req.userId = payload.id;
    next();
  });
}
