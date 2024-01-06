import express from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  updatePasswordController,
} from "../controllers/userController.js";
import { isAuth } from "../middelwares/authMiddelware.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/profile", isAuth, getUserProfileController);

router.get("/logout", isAuth, logoutController);

router.put("/update-password", isAuth, updatePasswordController);

export default router;
