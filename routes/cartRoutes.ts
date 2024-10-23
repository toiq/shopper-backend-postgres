import {
  addItemToCart,
  changeQuantity,
  deleteItemFromCart,
  getCart,
} from "@/controllers/cartController";
import errorHandler from "@/handlers/error-handler";
import authMiddleware from "@/middlewares/authMiddleware";
import { Router } from "express";

const cartRoutes = Router();

cartRoutes.get("/", [authMiddleware], errorHandler(getCart));
cartRoutes.post("/", [authMiddleware], errorHandler(addItemToCart));
cartRoutes.put("/:id", [authMiddleware], errorHandler(changeQuantity));
cartRoutes.delete("/:id", [authMiddleware], errorHandler(deleteItemFromCart));

export default cartRoutes;
