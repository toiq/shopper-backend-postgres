import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "@/controllers/productController";
import errorHandler from "@/handlers/error-handler";
import adminMiddleware from "@/middlewares/adminMiddleware";
import authMiddleware from "@/middlewares/authMiddleware";
import { Router } from "express";

const productRoutes: Router = Router();

productRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

productRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);

productRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);

productRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(listProducts)
);

productRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
);

export default productRoutes;
