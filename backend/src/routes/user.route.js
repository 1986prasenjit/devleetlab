import { Router } from "express";
import { checkUser, logOutUser, registerUser,userLogin } from "../controllers/auth.controller.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(userLogin);

router.route("/logout").post(authMiddleWare, logOutUser);

router.route("/checkUser").get(authMiddleWare, checkUser);


export default router;