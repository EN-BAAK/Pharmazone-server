import express from "express";
import {
  login,
  logout,
  register,
  verifyEmail,
  verifyToken,
} from "../controller/auth";
import {
  login as loginValidation,
  register as registerValidation,
  verifyEmail as verifyEmailValidation,
} from "../validation/auth";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", isAuthenticated, logout);
router.post("/verify/email", verifyEmailValidation, verifyEmail);

router.get("/verify", isAuthenticated, verifyToken);

export default router;
