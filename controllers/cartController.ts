import { NotFoundException } from "@/exceptions/not-found";
import { ErrorCode } from "@/exceptions/root";
import prismaClient from "@/prisma/client/prismaClient";
import { ChangeCartQuantitySchema, CreateCartSchema } from "@/schema/cart";
import { Product } from "@prisma/client";
import { Request, Response } from "express";

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user.id,
      ...validatedData,
    },
  });

  res.json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  try {
    await prismaClient.cartItem.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Cart item deleted successfully.",
    });
  } catch (error) {
    throw new NotFoundException(
      "CartItem not found.",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = ChangeCartQuantitySchema.parse(req.body);

  const updatedCartItem = await prismaClient.cartItem.update({
    where: {
      id: req.params.id,
    },
    data: validatedData,
  });

  res.json(updatedCartItem);
};

export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      product: true,
    },
  });

  res.json(cart);
};
