import { NextFunction, Request, Response } from "express";
import Companies from "../models/companies";
import PendingCompanies from "../models/pendingCompanies ";
import ErrorHandler, { catchAsyncErrors } from "../middleware/errorMiddleware";
import { generateVerificationCode } from "../misc/helpers";
import { compareHashedData, encrypt, encryptData } from "../misc/hashing";
import { generateToken } from "../utils/jwToken";
import { sendVerificationEmail } from "../misc/mailer";

export const register = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, phone, role } = req.body;

    const generatedVerificationCode: string = generateVerificationCode();
    const [hashedPassword] = encryptData(password);

    const pendingCompany = await PendingCompanies.findOne({
      where: { email },
    });

    const newPendingCompany = {
      email,
      name,
      password: hashedPassword,
      phone: phone ? encrypt(phone) : null,
      verificationCode: generatedVerificationCode,
      role,
      requestType: "register",
    };

    if (pendingCompany) {
      await pendingCompany.update(newPendingCompany, { where: { email } });
    } else {
      await PendingCompanies.create(newPendingCompany);
    }

    await sendVerificationEmail(email, generatedVerificationCode);

    res.status(201).json({
      success: true,
      message: "New user registered successfully",
    });
  }
);

export const resendVerificationCode = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const pendingCompany = await PendingCompanies.findOne({
      where: { email },
    });

    if (!pendingCompany)
      return next(new ErrorHandler("The email is not exist", 503));

    const generatedVerificationCode: string = generateVerificationCode();

    pendingCompany.verificationCode = generatedVerificationCode;
    await pendingCompany.save();

    await sendVerificationEmail(email, generatedVerificationCode);

    res.status(201).json({
      success: true,
      message: "New verification code was made successfully",
    });
  }
);

export const verifyEmail = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { verificationCode, email, requestType } = req.body;

    const company = await PendingCompanies.findOne({
      where: { email, requestType },
    });

    if (!company)
      return next(new ErrorHandler("The email does not exist", 503));

    const isVerificationCodeCorrect = await compareHashedData(
      verificationCode,
      company.verificationCode
    );

    if (!isVerificationCodeCorrect)
      return next(
        new ErrorHandler("The verification code is not correct", 400)
      );

    const { name, password, phone, role } = company;

    const newCompany = await Companies.create({
      name,
      password,
      phone: phone || null,
      email,
      role,
    });

    await PendingCompanies.destroy({ where: { email } });

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
    const { email, password } = req.body;

    const company = await Companies.findOne({ where: { email } });

    if (!company)
      return next(new ErrorHandler("This account is not exist", 404));

    const isPasswordCorrect = await compareHashedData(
      password,
      company.password
    );

    if (!isPasswordCorrect)
      return next(new ErrorHandler("Wrong password", 400));

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
