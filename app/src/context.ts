import { PrismaClient } from "@prisma/client";
import { getUserId } from "./services/auth/authentication";

export interface Context {
    prisma: PrismaClient;
    userId?: number;
}

export const prisma = new PrismaClient();

export const context = async function generateContext({ req }) {
    return {
        // add the entire HTTP request to context
        ...req,
        // add prisma for db queries
        prisma,
        // if authorization header is passed, add the userId to context
        userId:
            req && req.headers.authorization
                ? await getUserId(req, null)
                : null,
    };
};

// export default context;
