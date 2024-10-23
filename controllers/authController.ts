import { BadRequestException } from "@/exceptions/bad-request";
import { NotFoundException } from "@/exceptions/not-found";
import { ErrorCode } from "@/exceptions/root";
import prismaClient from "@/prisma/client/prismaClient";
import { RegisterSchema } from "@/schema/userSchema";
import { JWT_SECRET } from "@/secrets";
import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  RegisterSchema.parse(req.body);
  const { name, email, password } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });

  if (user) {
    throw new BadRequestException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.json(newUser);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    throw new NotFoundException(
      "User doesn't exist.",
      ErrorCode.USER_NOT_FOUND
    );
  }

  const passwordMatched = await compare(password, user.password);
  if (!passwordMatched) {
    throw new BadRequestException(
      "Incorrect credentials.",
      ErrorCode.INCORRECT_CREDENTIALS
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  res.json({ user, token });
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
