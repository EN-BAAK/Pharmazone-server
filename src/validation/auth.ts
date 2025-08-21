import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ErrorHandler, {
  catchAsyncErrors,
  handleValidationMiddleware,
} from "../middleware/errorMiddleware";
import { decryptAndTrim } from "../misc/hashing";
import Companies from "../models/companies";

const validateEmail = () => {
  return body("email")
    .notEmpty()
    .withMessage("Email is required")
    .customSanitizer((value) => decryptAndTrim(value))
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email address");
};

const validatePassword = () => {
  return body("password")
    .customSanitizer((value) => decryptAndTrim(value))
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long");
};

const validatePhone = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.phone) {
      return body("phone")
        .customSanitizer((value) => (value ? decryptAndTrim(value) : value))
        .isNumeric()
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number should be 10 exactly numbers")
        .run(req)
        .then(() => next())
        .catch(next);
    }

    next();
  };
};

const validateRole = () => {
  return body("role")
    .notEmpty()
    .withMessage("Role is required")
    .trim()
    .escape()
    .isIn(["fac", "pha"])
    .withMessage("Role is not allowed");
};

export const register = [
  body("name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Name is required"),
  validateEmail(),
  validatePassword(),
  validatePhone(),
  validateRole(),

  catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { companyName, email, password, role } = req.body;

    if (!companyName && !email && !password && !role)
      return next(new ErrorHandler("Please provide all details!", 400));

    const company = await Companies.findOne({ where: { email } });

    if (company)
      return next(new ErrorHandler("The email is already exist", 409));

    return handleValidationMiddleware(req, next);
  }),
];

export const verifyEmail = [
  body("verificationCode")
    .trim()
    .notEmpty()
    .withMessage("VerificationCode is required")
    .escape()
    .isLength({ min: 4, max: 4 })
    .withMessage("Valid verification code is required"),
  validateEmail(),

  catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { requestType } = req.body;

    if (!requestType || requestType !== "register")
      return next(new ErrorHandler("Internal server error", 500));

    return handleValidationMiddleware(req, next);
  }),
];

export const login = [
  validateEmail(),
  validatePassword(),

  catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email && !password)
      return next(new ErrorHandler("Please provide all details!", 400));

    return handleValidationMiddleware(req, next);
  }),
];

export const resendVerificationCode = [
  validateEmail(),

  catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const company = await Companies.findOne({
      where: { email },
    });

    if (company) return next(new ErrorHandler("Internal server error", 503));

    return handleValidationMiddleware(req, next);
  }),
];
