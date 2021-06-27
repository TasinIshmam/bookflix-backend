import { AuthenticationError } from "apollo-server-errors";

import config from "../../config/config";
const jwt = require("jsonwebtoken");

export interface authTokenPayload {
    userId: number;
}

export function getTokenPayload(token): authTokenPayload {
    return jwt.verify(token, config.jwtSecret);
}

export function getUserId(req, authToken): number | undefined {
    try {
        if (req) {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.replace("Bearer ", "");
                if (!token) {
                    throw new AuthenticationError("No token found");
                }

                //todo check if userId actually exists in DB.
                const { userId } = getTokenPayload(token);
                return userId;
            }
        } else if (authToken) {
            const { userId } = getTokenPayload(authToken);
            return userId;
        }
    } catch (e) {
        throw new AuthenticationError("Authentication failed");
    }
}
