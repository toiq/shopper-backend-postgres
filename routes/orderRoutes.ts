import {
  cancelOrder,
  changeStatus,
  createOrder,
  getOrderById,
  listAllOrders,
  listOrders,
  listUserOrders,
} from "@/controllers/orderController";
import errorHandler from "@/handlers/error-handler";
import adminMiddleware from "@/middlewares/adminMiddleware";
import authMiddleware from "@/middlewares/authMiddleware";
import { Router } from "express";

const orderRoutes = Router();

orderRoutes.post("/", [authMiddleware], errorHandler(createOrder));

orderRoutes.get("/", [authMiddleware], errorHandler(listOrders));

orderRoutes.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

orderRoutes.get(
  "/index",
  [authMiddleware, adminMiddleware],
  errorHandler(listAllOrders)
);
orderRoutes.get(
  "/users/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(listUserOrders)
);

orderRoutes.get("/:id/status", [authMiddleware], errorHandler(changeStatus));

orderRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById));

export default orderRoutes;
