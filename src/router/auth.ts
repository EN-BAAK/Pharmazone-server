import express from "express";
import {
  login,
  logout,
  register,
  resendVerificationCode,
  verifyEmail,
  verifyToken,
} from "../controller/auth";
import {
  login as loginValidation,
  register as registerValidation,
  verifyEmail as verifyEmailValidation,
  resendVerificationCode as resendVerificationCodeValidation,
} from "../validation/auth";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", isAuthenticated, logout);
router.post("/verify", verifyEmailValidation, verifyEmail);

router.get("/verify", isAuthenticated, verifyToken);

router.patch(
  "/verify",
  resendVerificationCodeValidation,
  resendVerificationCode
);

export default router;
