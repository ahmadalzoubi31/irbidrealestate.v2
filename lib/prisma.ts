import { PrismaClient } from "@prisma/client";

// const loggedUserName = data.value?.user?.name;

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Middleware 1
// prisma.$extends({
//   name: "AddCreatedByAndUpdatedBy",
//   query: {
//     building: {
//       async create({ args, query }) {
//         if (!args.data.createdBy) {
//           args.data.createdBy = loggedUserName; // Automatically set `createdBy`
//         }
//         return query(args); // Proceed with the query
//       },
//       async update({ args, query }) {
//         if (!args.data.updatedBy) {
//           args.data.updatedBy = loggedUserName; // Automatically set `updatedBy`
//         }
//         return query(args); // Proceed with the query
//       },
//     },
//   },
// });

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
