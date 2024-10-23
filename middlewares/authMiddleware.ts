import { ErrorCode } from "@/exceptions/root";
import { UnauthorizedException } from "@/exceptions/unauthorized";
import prismaClient from "@/prisma/client/prismaClient";
import { JWT_SECRET } from "@/secrets";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED_ACCESS)
    );
  }

  try {
    const payload: any = jwt.verify(token!, JWT_SECRET);
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      return next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED_ACCESS)
      );
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED_ACCESS)
    );
  }
};

export default authMiddleware;
