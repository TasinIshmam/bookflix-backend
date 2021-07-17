import { Context, prisma } from "../context";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";

import { authTokenPayload } from "../services/auth/authentication";
import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { updateReadingHistoryInput } from "./types";
import logger from "../utils/logger";

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
            try {
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
            } catch (e) {
                if (e.code === "P2003") {
                    //foreign key constraint because invalid authorId/userId. Ignore this entry and continue with update.
                    continue;
                } else {
                    throw e;
                }
            }

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

export async function setFavoriteBooks(parent, args, context: Context) {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");

    let { bookIds, operation } = args;
    let intBookIds: number[] = bookIds.map((bookId) => parseInt(bookId));

    if (operation === "add") {
        // add is an INEFFICIENT OPERATION. Runs one CRUD per Book.
        let alreadyFavorite = await prisma.userBookInteraction.count({
            where: {
                bookId: {
                    in: intBookIds,
                },
                userId: userId,
                isFavorite: true,
            },
        });

        let createdOrUpdatedBooks = 0; // will include bookInteractions that are ALREADY set to favorite.
        for (const bookId of intBookIds) {
            try {
                await context.prisma.userBookInteraction.upsert({
                    where: {
                        bookId_userId: {
                            bookId: bookId,
                            userId: userId,
                        },
                    },
                    update: {
                        isFavorite: true,
                    },
                    create: {
                        bookId: bookId,
                        userId: userId,
                        isFavorite: true,
                    },
                });
                createdOrUpdatedBooks += 1;
            } catch (e) {
                if (e.code === "P2003") {
                    //foreign key constraint because invalid bookId. Ignore this entry and continue with update.
                    continue;
                } else {
                    throw e;
                }
            }
        }
        return { count: createdOrUpdatedBooks - alreadyFavorite };
    } else if (operation === "remove") {
        let alreadyNotFavorite = await prisma.userBookInteraction.count({
            where: {
                bookId: {
                    in: intBookIds,
                },
                userId: userId,
                isFavorite: false,
            },
        });

        // count will include UserBookInteraction that are ALREADY set to NOT favorite.
        let { count } = await prisma.userBookInteraction.updateMany({
            where: {
                bookId: {
                    in: intBookIds,
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

export async function setFavoriteGenres(parent, args, context: Context) {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");

    const { genreIds, operation } = args;
    const intGenreIds = genreIds.map((genreId) => parseInt(genreId));

    if (operation === "add") {
        let data = intGenreIds.map((genreId) => {
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
                    in: intGenreIds,
                },
                userId,
            },
        });
        return { count };
    } else throw new UserInputError(`Unsupported operation: ${operation}`);
}

export async function setBookToReadLater(parent, args, context: Context) {
    const { userId } = context;
    const { bookId, operation } = args;

    const isOnReadLaterList = operation === "add";

    if (!userId) throw new AuthenticationError("Not logged in");

    let result = await prisma.userBookInteraction.upsert({
        where: {
            bookId_userId: {
                bookId: parseInt(bookId),
                userId: userId,
            },
        },
        update: {
            isOnReadLaterList: isOnReadLaterList,
        },
        create: {
            bookId: parseInt(bookId),
            userId: userId,
            isOnReadLaterList: isOnReadLaterList,
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
