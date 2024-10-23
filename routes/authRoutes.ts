import { login, me, register } from "@/controllers/authController";
import errorHandler from "@/handlers/error-handler";
import authMiddleware from "@/middlewares/authMiddleware";
import { Router } from "express";

const authRoutes: Router = Router();

authRoutes.post("/register", errorHandler(register));
authRoutes.post("/login", errorHandler(login));
authRoutes.get("/me", [authMiddleware], errorHandler(me));

export default authRoutes;
