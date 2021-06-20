import { Context } from "../context";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";

import { getUserId } from "../services/auth/authentication";

export async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10);

    const user = await context.prisma.user.create({
        data: { ...args, password },
    });

    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    return {
        token,
        user,
    };
}

export async function login(parent, args, context, info) {
    const user = await context.prisma.user.findUnique({
        where: { username: args.username },
    });
    if (!user) {
        throw new Error("No such user found");
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    return {
        token,
        user,
    };
}
