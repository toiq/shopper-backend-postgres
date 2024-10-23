import { NotFoundException } from "@/exceptions/not-found";
import { ErrorCode } from "@/exceptions/root";
import prismaClient from "@/prisma/client/prismaClient";
import { productSchema } from "@/schema/productSchema";
import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
  productSchema.parse(req.body);
  const newProduct = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });

  return res.json(newProduct);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }

    const updatedProduct = await prismaClient.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...product,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    throw new NotFoundException(
      "Product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prismaClient.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Deleted product successfully.",
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const listProducts = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();

  if (!req.query?.skip) {
    req.query.skip = "0";
  }

  const products = await prismaClient.product.findMany({
    skip: +req.query.skip,
    take: 5,
  });

  res.json({
    count,
    data: products,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: req.params.id,
      },
    });

    res.json(product);
  } catch (error) {
    throw new NotFoundException(
      "Product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};
