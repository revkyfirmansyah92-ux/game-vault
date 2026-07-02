import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { getUserByUsername, ServerUser } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "gamevault-cosmic-secret-key-1337-v1";

// Extend Express Request interface to hold auth user
export interface AuthenticatedRequest extends Request {
  user?: ServerUser;
}

export function generateToken(payload: { username: string; email: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { username: string; email: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
    if (signature !== expectedSignature) return null;

    const parsedBody = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (parsedBody.exp && Date.now() > parsedBody.exp) {
      return null; // Token expired
    }
    return parsedBody;
  } catch (err) {
    return null;
  }
}

// Authentication middleware
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ error: "Invalid or expired session token." });
  }

  const user = getUserByUsername(payload.username);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  req.user = user;
  next();
}
