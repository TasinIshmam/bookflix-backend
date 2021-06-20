import config from "../../config/config";

const jwt = require("jsonwebtoken");

export const APP_SECRET = config.jwtSecret;

export function getTokenPayload(token) {
    return jwt.verify(token, config.jwtSecret);
}

export function getUserId(req, authToken): number {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace("Bearer ", "");
            if (!token) {
                throw new Error("No token found");
            }
            const { userId } = getTokenPayload(token);
            return userId;
        }
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }

    throw new Error("Not authenticated");
}
