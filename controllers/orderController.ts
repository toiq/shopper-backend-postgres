import { NotFoundException } from "@/exceptions/not-found";
import { ErrorCode } from "@/exceptions/root";
import prismaClient from "@/prisma/client/prismaClient";
import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
  // Steps
  // Create transactions
  // List cart items, if empty return error message
  // Calculate the total price
  // Retrieve address of user
  // Define computed field for formatted address on address model
  // We will create order and order products
  // Create event
  // Finally empty the cart

  return prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.json({
        message: "Cart is empty",
      });
    }

    const price = cartItems.reduce(
      (prev, curr: any) => prev + curr.quantity * +curr.product.price,
      0
    );

    const address = await tx.address.findFirstOrThrow({
      where: {
        id: req.user.defaultShippingAddress,
      },
    });

    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address.formattedAddress,
        products: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    const oderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        id: req.user.id,
      },
    });

    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });

  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELLED",
      },
    });

    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found.", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        userId: req.user.id,
      },
      include: {
        products: true,
        events: true,
      },
    });

    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found.", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = req.query.status;

  if (status) {
    whereClause = {
      status,
    };
  }

  if (!req.query.skip) {
    req.query.skip = "0";
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +req.query.skip,
    take: 5,
  });

  res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  // Todo: Wrap it in transaction
  try {
    const order = await prismaClient.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });

    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
      },
    });

    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found.", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = {
    userId: req.params.id,
  };
  // Not sure
  const status = req.params.status;

  if (status) {
    whereClause = {
      ...whereClause,
      status,
    };
  }

  if (!req.query.skip) {
    req.query.skip = "0";
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +req.query.skip,
    take: 5,
  });

  res.json(orders);
};
