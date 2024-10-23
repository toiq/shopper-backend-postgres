import { Router } from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import userRoutes from "./userRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productRoutes);
rootRouter.use("/users", userRoutes);
rootRouter.use("/carts", cartRoutes);
rootRouter.use("/orders", orderRoutes);

export default rootRouter;
