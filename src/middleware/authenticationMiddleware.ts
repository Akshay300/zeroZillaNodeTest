import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const secretKey = "secret";

export function verifyToken(req: Request, res: Response, next: any) {
    const authHeader = req.headers["authorization"];
  
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const [bearer, token] = authHeader.split(" ");
  
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid token format" });
    }
  
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        console.error("Error verifying token:", err);
        return res.status(403).json({ message: "Forbidden" });
      }
  
      next();
    });
  }