import { NextFunction, Response } from "express";
import { Company as CompanyType } from "src/misc/types";
import jwt from "jsonwebtoken";
import ErrorHandler from "src/middleware/errorMiddleware";

const generateJsonWebToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const generateToken = (
  company: Omit<CompanyType, "password">,
  message: string,
  statusCode: number,
  res: Response,
  next: NextFunction
) => {
  if (!company.id) throw next(new ErrorHandler("Invalid data", 400));
  const token = generateJsonWebToken(company.id);

  res
    .status(statusCode)
    .set("Authorization", `Bearer ${token}`)
    .json({ success: true, message, company, token });
};

export const verifyToken = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string
  ) as jwt.JwtPayload;
};
