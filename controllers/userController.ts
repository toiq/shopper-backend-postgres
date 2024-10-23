import { BadRequestException } from "@/exceptions/bad-request";
import { NotFoundException } from "@/exceptions/not-found";
import { ErrorCode } from "@/exceptions/root";
import prismaClient from "@/prisma/client/prismaClient";
import { AddressSchema, UpdateUserSchema } from "@/schema/userSchema";
import { Address } from "@prisma/client";
import { Request, Response } from "express";

export const createAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  const address = await prismaClient.address.create({
    data: {
      district: "Bogura",
      city: "Bogura Sadar",
      details: "Near Nur Bakery",
      postCode: 5800,
      userId: req.user.id,
    },
  });

  res.json(address);
};

export const updateAddress = async (req: Request, res: Response) => {};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    throw new NotFoundException(
      "Address not found.",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddressess = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user.id,
    },
  });

  res.json(addresses);
};

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddressId) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddressId,
        },
      });

      if (shippingAddress.userId !== req.user.id) {
        throw new BadRequestException(
          "Address does not belong to user",
          ErrorCode.ADDRESS_DOES_NOT_BELONG
        );
      }
    } catch (error) {
      throw new NotFoundException(
        "Address not found.",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
  }

  if (validatedData.defaultBillingAddressId) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddressId,
        },
      });

      if (billingAddress.userId !== req.user.id) {
        throw new BadRequestException(
          "Address does not belong to user",
          ErrorCode.ADDRESS_DOES_NOT_BELONG
        );
      }
    } catch (error) {
      throw new NotFoundException(
        "Address not found.",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: validatedData,
  });

  res.json(updatedUser);
};

export const listUsers = async (req: Request, res: Response) => {
  if (!req.query.skip) {
    req.query.skip = "0";
  }
  const users = await prismaClient.user.findMany({
    skip: +req.query.skip,
    take: 5,
  });

  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: req.params.id,
      },
      include: {
        addresses: true,
      },
    });

    res.json(user);
  } catch (error) {
    throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND);
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        role: req.body.role,
      },
    });

    res.json(user);
  } catch (error) {
    throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND);
  }
};
