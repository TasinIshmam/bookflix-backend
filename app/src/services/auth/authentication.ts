import { AuthenticationError } from "apollo-server-errors";

import config from "../../config/config";
import { typeFromAST } from "graphql";
import { prisma } from "../../context";
const jwt = require("jsonwebtoken");

export interface authTokenPayload {
    userId: number;
}

export function getTokenPayload(token): authTokenPayload {
    return jwt.verify(token, config.jwtSecret);
}

// using this does not make much sense given we're doing client side sessions.
// every request to server would need an additional DB trip with this approach.
async function assertUserExistsInDatabase(userId: number) {
    const isValidRecord = await prisma.user.count({
        where: {
            id: userId,
        },
    });

    if (isValidRecord === 0) {
        throw new Error("Invalid userId");
    }
}

export async function getUserId(req, authToken): Promise<number | undefined> {
    try {
        if (req) {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.replace("Bearer ", "");
                if (!token) {
                    throw new AuthenticationError("No token found");
                }

                const { userId } = getTokenPayload(token);

                // await assertUserExistsInDatabase(userId);
                return userId;
            }
        } else if (authToken) {
            const { userId } = getTokenPayload(authToken);
            // await assertUserExistsInDatabase(userId);
            return userId;
        }
    } catch (e) {
        throw new AuthenticationError("Authentication failed");
    }
}
