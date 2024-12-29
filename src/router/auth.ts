import express from "express";
import { login, register, verifyEmail } from "src/controller/auth";
import {
  login as loginValidation,
  register as registerValidation,
  verifyEmail as verifyEmailValidation,
} from "src/validation/auth";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/verify/email", verifyEmailValidation, verifyEmail);

export default router;
