import { NextFunction, Response } from "express";
import { Companies as CompaniesType } from "../misc/types";
import jwt from "jsonwebtoken";
import ErrorHandler from "../middleware/errorMiddleware";
import { getSafeCompany } from "../misc/helpers";

const generateJsonWebToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const generateToken = (
  company: CompaniesType,
  message: string,
  statusCode: number,
  res: Response,
  next: NextFunction
) => {
  if (!company.id) throw next(new ErrorHandler("Invalid data", 400));
  const token = generateJsonWebToken(company.id);

  const safeCompany = getSafeCompany(company);

  res
    .status(statusCode)
    .set("Authorization", `Bearer ${token}`)
    .json({ success: true, message, company: safeCompany, token });
};

export const verifyToken = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string
  ) as jwt.JwtPayload;
};
