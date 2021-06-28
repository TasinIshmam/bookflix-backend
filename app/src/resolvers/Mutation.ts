import { Context, prisma } from "../context";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";

import { authTokenPayload } from "../services/auth/authentication";
import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { updateReadingHistoryInput } from "./types";

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

export async function setFavoriteAuthors(parent, args, context: Context) {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");

    let { authorIds, operation } = args;
    let intAuthorIds: number[] = authorIds.map((authorId) =>
        parseInt(authorId),
    );

    let res = [];

    if (operation === "add") {
        // add is an INEFFICIENT OPERATION. Runs one CRUD per author.
        let alreadyFavorite = await prisma.userAuthorInteraction.count({
            where: {
                authorId: {
                    in: intAuthorIds,
                },
                userId: userId,
                isFavorite: true,
            },
        });

        let createdOrUpdatedAuthors = 0; // will include authorInteractions that are ALREADY set to favorite.
        for (const authorId of intAuthorIds) {
            await context.prisma.userAuthorInteraction.upsert({
                where: {
                    authorId_userId: {
                        authorId: authorId,
                        userId: userId,
                    },
                },
                update: {
                    isFavorite: true,
                },
                create: {
                    authorId: authorId,
                    userId: userId,
                    isFavorite: true,
                },
            });

            createdOrUpdatedAuthors += 1;
        }
        return { count: createdOrUpdatedAuthors - alreadyFavorite };
    } else if (operation === "remove") {
        let alreadyNotFavorite = await prisma.userAuthorInteraction.count({
            where: {
                authorId: {
                    in: intAuthorIds,
                },
                userId: userId,
                isFavorite: false,
            },
        });

        // count will include authorInteractions that are ALREADY set to NOT favorite.
        let { count } = await prisma.userAuthorInteraction.updateMany({
            where: {
                authorId: {
                    in: intAuthorIds,
                },
                userId: userId,
            },
            data: {
                isFavorite: false,
            },
        });
        return { count: count - alreadyNotFavorite };
    } else throw new UserInputError(`Unsupported operation: ${operation}`);
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
