import { Router } from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import userRoutes from "./userRoutes";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productRoutes);
rootRouter.use("/users", userRoutes);

export default rootRouter;
