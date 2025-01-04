import { body, CustomValidator } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ErrorHandler, {
  catchAsyncErrors,
  handleValidationMiddleware,
} from "../middleware/errorMiddleware";

const validatePhoneIfPasswordExists: CustomValidator = (value, { req }) => {
  if (req.body.phone) {
    return body("phone")
      .trim()
      .escape()
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone should be 10 numbers")
      .run(req);
  }
  return true;
};

export const register = [
  body("name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone").custom(validatePhoneIfPasswordExists),
  body("role")
    .trim()
    .escape()
    .isIn(["fac", "pha"])
    .withMessage("Role is not allowed"),

  catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { companyName, email, password, role } = req.body;

    if (!companyName && !email && !password && !role)
      return next(new ErrorHandler("Please provide all details!", 400));

    return handleValidationMiddleware(req, next);
  }),
];

export const verifyEmail = [
  body("verificationCode")
    .trim()
    .escape()
    .isLength({ min: 4, max: 4 })
    .withMessage("Valid verification code is required"),
  body("email").isEmail().normalizeEmail().withMessage("email is required"),
  body("role")
    .trim()
    .escape()
    .isIn(["fac", "pha"])
    .withMessage("Role is not allowed"),

  (req: Request, res: Response, next: NextFunction) => {
    const { requestType } = req.body;

    if (!requestType || requestType !== "register")
      return next(new ErrorHandler("Internal server error", 500));

    return handleValidationMiddleware(req, next);
  },
];

export const login = [
  body("email").isEmail().normalizeEmail().withMessage("email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .trim()
    .escape()
    .isIn(["fac", "pha"])
    .withMessage("Role is not allowed"),

  (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email && !password)
      return next(new ErrorHandler("Please provide all details!", 400));

    return handleValidationMiddleware(req, next);
  },
];