import { PrismaClient } from "../../generated/prisma";

declare global {
  var __database__: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__database__) {
    global.__database__ = new PrismaClient();
  }
  prisma = global.__database__;
}

export default prisma;
