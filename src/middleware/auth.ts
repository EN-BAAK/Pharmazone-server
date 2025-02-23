import { NextFunction, Request, Response } from "express";
import ErrorHandler, { catchAsyncErrors } from "./errorMiddleware";
import { verifyToken } from "../utils/jwToken";
import Company from "../models/company";

export const isAuthenticated = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.userId = decoded.id;

    const company = await Company.findByPk(req.userId);

    if (!company) return next(new ErrorHandler("Internal server error", 500));

    next();
  }
);
