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
import {
    ApolloError,
    AuthenticationError,
    UserInputError,
} from "apollo-server-errors";
import { author, book } from "./Query";

export async function signup(parent, args, context: Context) {
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

export async function login(parent, args, context: Context) {
    const user = await context.prisma.user.findUnique({
        where: { username: args.username },
    });
    if (!user) {
        throw new AuthenticationError("No such user found");
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new AuthenticationError("Invalid password");
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

export async function setFavoriteBook(parent, args, context: Context) {
    const { userId } = context;
    const { bookId, operation } = args;

    const isFavorite = operation === "add";

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
            userId: userId,
            isFavorite: isFavorite,
        },
    });
    return result;
}

export async function setFavoriteGenres(parent, args, context: Context) {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");

    const { genreIds, operation } = args;
    let res = [];

    if (operation === "add") {
        let data = genreIds.map((genreId) => {
            return {
                genreId,
                userId,
            };
        });
        let { count } = await prisma.favoriteGenre.createMany({
            data,
            skipDuplicates: true,
        });
        return { count };
    } else if (operation === "remove") {
        let { count } = await prisma.favoriteGenre.deleteMany({
            where: {
                genreId: {
                    in: genreIds,
                },
                userId,
            },
        });
        return { count };
    } else throw new UserInputError(`Unsupported operation: ${operation}`);
}

export async function setBookToMyList(parent, args, context: Context) {
    const { userId } = context;
    const { bookId, operation } = args;

    const isOnMyList = operation === "add";

    if (!userId) throw new AuthenticationError("Not logged in");

    let result = await prisma.userBookInteraction.upsert({
        where: {
            bookId_userId: {
                bookId: parseInt(bookId),
                userId: userId,
            },
        },
        update: {
            isOnMyList: isOnMyList,
        },
        create: {
            bookId: parseInt(bookId),
            userId: userId,
            isOnMyList: isOnMyList,
        },
    });

    return result;
}

export async function updateBookReadingHistory(parent, args, context: Context) {
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
            userId: userId,
            ...update,
        },
    });

    return result;
}
