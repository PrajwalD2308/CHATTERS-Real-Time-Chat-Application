import express from "express";
import { userRegister } from "../routControlers/userroutControler.js";
import { userLogin } from "../routControlers/userroutControler.js";
import { userLogout } from "../routControlers/userroutControler.js";
const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/logout", userLogout);

export default router;
