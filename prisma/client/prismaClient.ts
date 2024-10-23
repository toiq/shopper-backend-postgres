import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          city: true,
          district: true,
          details: true,
          postCode: true,
        },
        compute: (address) =>
          `${address.details} | ${address.city} | (${address.postCode}) | ${address.district}`,
      },
    },
  },
});

export default prismaClient;
