import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const AddressSchema = z.object({
  district: z.string(),
  city: z.string(),
  details: z.string(),
  postCode: z.number(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddressId: z.string().optional(),
  defaultBillingAddressId: z.string().optional(),
});
