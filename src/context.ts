import { PrismaClient } from "@prisma/client";
import { getUserId } from "./services/auth/authentication";

export interface Context {
    prisma: PrismaClient;
    userId?: number;
}

const prisma = new PrismaClient();

export const context = ({ req }) => {
    return {
        ...req,
        prisma,
        userId: req && req.headers.authorization ? getUserId(req, null) : null,
    };
};
