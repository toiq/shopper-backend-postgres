import {
  createAddress,
  deleteAddress,
  listAddressess,
  updateAddress,
  updateUser,
} from "@/controllers/userController";
import errorHandler from "@/handlers/error-handler";
import authMiddleware from "@/middlewares/authMiddleware";
import { Router } from "express";

const userRoutes: Router = Router();

userRoutes.get("/address", [authMiddleware], errorHandler(listAddressess));

userRoutes.post("/address", [authMiddleware], errorHandler(createAddress));

userRoutes.put("/address/:id", [authMiddleware], errorHandler(updateAddress));

userRoutes.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);

userRoutes.put("/", [authMiddleware], errorHandler(updateUser));

export default userRoutes;
