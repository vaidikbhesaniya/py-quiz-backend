"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
function singletonPrismaClient() {
    return new client_1.PrismaClient();
}
const prisma = globalThis.prismaGlobal ?? singletonPrismaClient();
exports.default = prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
