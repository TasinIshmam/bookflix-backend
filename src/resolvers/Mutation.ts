import { Context, prisma } from "../context";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";

interface updateReadingHistoryInput {
    currentPage?: number;
    isFinishedReading?: boolean;
}

import { authTokenPayload, getUserId } from "../services/auth/authentication";
import logger from "../utils/logger";
import { AuthenticationError } from "apollo-server-errors";
import { book } from "./Query";

export async function signup(parent, args, context) {
    const password = await bcrypt.hash(args.password, 10);

    const user = await context.prisma.user.create({
        data: { ...args, password },
    });

    const token = jwt.sign(
        { userId: user.id } as authTokenPayload,
        config.jwtSecret,
    );

    return {
        token,
        user,
    };
}

export async function login(parent, args, context) {
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

    const token = jwt.sign(
        { userId: user.id } as authTokenPayload,
        config.jwtSecret,
    );

    return {
        token,
        user,
    };
}

export async function setFavoriteBook(parent, args, context) {
    const { userId } = context;
    const { bookId, isFavorite } = args;

    if (!userId) throw new AuthenticationError("Not logged in");

    let result = await prisma.userBookInteraction.upsert({
        where: {
            bookId_userId: {
                bookId: parseInt(bookId),
                userId: userId,
            },
        },
        update: {
            isFavorite: isFavorite,
        },
        create: {
            bookId: parseInt(bookId),
            userId: parseInt(userId),
            isFavorite: isFavorite,
        },
    });

    return result;
}

export async function setFavoriteGenres(parent, args, context) {}

export async function addBookToMyList(parent, args, context) {}

export async function updateBookReadingHistory(parent, args, context) {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");

    const { bookId, update } = args;

    let result = await prisma.userBookInteraction.upsert({
        where: {
            bookId_userId: {
                bookId: parseInt(bookId),
                userId: userId,
            },
        },
        update: update as updateReadingHistoryInput,
        create: {
            bookId: parseInt(bookId),
            userId: parseInt(userId),
            ...update,
        },
    });

    return result;
}
