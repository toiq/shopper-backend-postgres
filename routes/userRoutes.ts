import {
  changeUserRole,
  createAddress,
  deleteAddress,
  getUserById,
  listAddressess,
  listUsers,
  updateAddress,
  updateUser,
} from "@/controllers/userController";
import errorHandler from "@/handlers/error-handler";
import adminMiddleware from "@/middlewares/adminMiddleware";
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
userRoutes.put(
  "/:id/role",
  [authMiddleware, adminMiddleware],
  errorHandler(changeUserRole)
);
userRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers));
userRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getUserById)
);

export default userRoutes;
