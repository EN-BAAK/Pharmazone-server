import { NextFunction, Request, Response } from "express";
import Company from "../models/company";
import CompanyAuth from "../models/companyAuth";
import ErrorHandler, { catchAsyncErrors } from "../middleware/errorMiddleware";
import { comparePassword, generateVerificationCode } from "../misc/helpers";
import { generateToken } from "../utils/jwToken";
import { sendVerificationEmail } from "../misc/mailer";

export const register = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, phone, role } = req.body;

    const company = await Company.findOne({ where: { email } });

    if (company)
      return next(new ErrorHandler("The email is already exist", 409));

    const generatedVerificationCode: string = generateVerificationCode();

    let companyAuth = await CompanyAuth.findOne({ where: { email } });

    const newCompanyAuth = {
      email,
      name,
      password,
      phone: phone || null,
      verificationCode: generatedVerificationCode,
      role,
      requestType: "register",
    };

    if (companyAuth) {
      await companyAuth.update(newCompanyAuth, { where: { email } });
    } else {
      await CompanyAuth.create(newCompanyAuth);
    }
    await sendVerificationEmail(email, generatedVerificationCode);

    res.status(201).json({
      success: true,
      message: "New user registered successfully",
    });
  }
);

export const verifyEmail = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      verificationCode,
      email,
      requestType,
      role: roleRequest,
    } = req.body;

    const company = await CompanyAuth.findOne({
      where: { email, requestType },
    });

    if (!company)
      return next(new ErrorHandler("The email does not exist", 404));

    if (company.verificationCode !== verificationCode)
      return next(
        new ErrorHandler("The verification code is not correct", 400)
      );

    const { name, password, phone, role } = company;

    if (role !== roleRequest)
      return next(new ErrorHandler("Internal server error", 500));

    const newCompany = await Company.create({
      name,
      password,
      phone: phone || null,
      email,
      role,
    });

    await CompanyAuth.destroy({ where: { email } });

    generateToken(
      newCompany,
      "Company manager logged in successfully",
      201,
      res,
      next
    );
  }
);

export const login = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;
    const company = await Company.findOne({ where: { email } });

    if (!company)
      return next(new ErrorHandler("This account is not exist", 404));

    if (role !== company.role)
      return next(new ErrorHandler("Internal server error", 500));
    console.log(company, company.password, typeof company.password);
    const correctPassword = await comparePassword(password, company.password);

    if (!correctPassword) return next(new ErrorHandler("Wrong password", 400));

    generateToken(
      company,
      "Company manager logged in successfully",
      200,
      res,
      next
    );
  }
);

export const logout = catchAsyncErrors(async (req: Request, res: Response) => {
  res
    .status(200)
    .set("Authorization", "")
    .json({ success: true, message: "Logged out successfully" });
});

export const verifyToken = catchAsyncErrors(
  async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
    });
  }
);
