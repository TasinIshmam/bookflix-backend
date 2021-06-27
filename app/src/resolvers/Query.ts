import { Context, prisma } from "../context";
import { AuthenticationError } from "apollo-server-errors";
import { NotFoundError } from "../services/errors/notFoundError";
import { convertObjectToArrayOfObjects } from "../utils/misc";
import logger from "../utils/logger";
import { Booklist } from "./types";
import {
    getHighlightBooks,
    getPopularGenreBasedRecommendations,
} from "../services/feed";

export const ping = () => "Server Running";

export async function book(parent, args, context: Context) {
    const { prisma } = context;
    const { bookId } = args;

    const book = await prisma.book.findUnique({
        where: {
            id: parseInt(bookId),
        },
    });

    if (!book) {
        throw new NotFoundError(`No book with bookId ${bookId}`);
    }

    return book;
}

export async function author(parent, args, context: Context) {
    const { prisma } = context;
    const { authorId } = args;

    const author = await prisma.author.findUnique({
        where: {
            id: parseInt(authorId),
        },
    });

    if (!author) {
        throw new NotFoundError(`No author with authorId ${authorId}`);
    }

    return author;
}

export async function user(parent, args, context: Context) {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");

    return context.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
}

export async function userBookInteraction(parent, args, context: Context) {
    const { userId } = context;
    const { bookId } = args;
    if (!userId) throw new AuthenticationError("Not logged in");

    let bookInteraction = await context.prisma.userBookInteraction.findUnique({
        where: {
            bookId_userId: {
                bookId: parseInt(bookId),
                userId: userId,
            },
        },
        rejectOnNotFound: true,
    });
    return bookInteraction;
}

export async function search(parent, args, context: Context) {
    const { filter, paginate, orderBy } = args;

    const where = filter
        ? {
              OR: [
                  {
                      title: { contains: args.filter },
                  },
                  {
                      authors: {
                          some: {
                              name: { contains: args.filter },
                          },
                      },
                  },
                  {
                      genres: {
                          some: {
                              name: { contains: args.filter },
                          },
                      },
                  },
              ],
          }
        : {};

    // optional chaining syntax used for skip and take. Ref: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
    const results = await context.prisma.book.findMany({
        where,
        orderBy: convertObjectToArrayOfObjects(orderBy),
        skip: paginate?.skip,
        take: paginate?.take,
    });

    const count = await context.prisma.book.count({ where });

    return {
        id: "search-" + JSON.stringify(args),
        books: results,
        count,
        category: "search",
    };
}

export async function favoriteBooks(
    parent,
    args,
    context: Context,
): Promise<Booklist> {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");
    const { paginate, orderBy } = args;

    // get the book Ids of user's favorite books.
    const favoriteBookInteraction = await context.prisma.userBookInteraction.findMany(
        {
            where: {
                userId: userId,
                isFavorite: true,
            },
            select: { bookId: true },
        },
    );

    // Convert syntax. Eg: [ { bookId: 6 }, { bookId: 5 } ]  =>  [ 6, 5 ]
    const bookIdArray = favoriteBookInteraction.map(
        (interaction) => interaction.bookId,
    );

    //generate search condition
    const bookSearchCondition = { id: { in: bookIdArray } };

    const books = await context.prisma.book.findMany({
        where: bookSearchCondition,
        orderBy: convertObjectToArrayOfObjects(orderBy),
        skip: paginate?.skip,
        take: paginate?.take,
    });

    const count = await context.prisma.book.count({
        where: bookSearchCondition,
    });

    return {
        id: `favoriteBooks-${userId}:` + JSON.stringify(args),
        books,
        count,
        category: "favoriteBooks",
    };
}

export async function myList(
    parent,
    args,
    context: Context,
): Promise<Booklist> {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");
    const { paginate, orderBy } = args;

    // get the book Ids of user's favorite books.
    const myListBookInteractions = await context.prisma.userBookInteraction.findMany(
        {
            where: {
                userId: userId,
                isOnMyList: true,
            },
            select: { bookId: true },
        },
    );

    // Convert syntax. Eg: [ { bookId: 6 }, { bookId: 5 } ]  =>  [ 6, 5 ]
    const bookIdArray = myListBookInteractions.map(
        (interaction) => interaction.bookId,
    );

    //generate search condition
    const bookSearchCondition = { id: { in: bookIdArray } };

    const books = await context.prisma.book.findMany({
        where: bookSearchCondition,
        orderBy: convertObjectToArrayOfObjects(orderBy),
        skip: paginate?.skip,
        take: paginate?.take,
    });

    const count = await context.prisma.book.count({
        where: bookSearchCondition,
    });

    return {
        id: `myList-${userId}:` + JSON.stringify(args),
        books,
        count,
        category: "myList",
    };
}

export async function authors(parent, args, context: Context) {
    const { paginate, orderBy } = args;

    const authors = await context.prisma.author.findMany({
        orderBy: convertObjectToArrayOfObjects(orderBy),
        skip: paginate?.skip,
        take: paginate?.take,
    });

    const count = await context.prisma.author.count({});

    return {
        id: `authors:` + JSON.stringify(args),
        count,
        authors,
    };
}

export async function genres(parent, args, context: Context) {
    const { paginate, orderBy } = args;

    const genres = await context.prisma.genre.findMany({
        orderBy: convertObjectToArrayOfObjects(orderBy),
        skip: paginate?.skip,
        take: paginate?.take,
    });

    const count = await context.prisma.genre.count({});

    return {
        id: `genres:` + JSON.stringify(args),
        count,
        genres,
    };
}

export async function books(parent, args, context: Context): Promise<Booklist> {
    const { paginate, orderBy, filter } = args;

    // filter?.authors  -> shorthand for filters? filters.author : undefined.
    const authorsCondition = filter?.authors
        ? {
              some: {
                  id: {
                      // map array of strings into array of integers.
                      in: filter.authors.map((author) => parseInt(author)),
                  },
              },
          }
        : undefined;

    const genresCondition = filter?.genres
        ? {
              some: {
                  id: {
                      in: filter.genres.map((genres) => parseInt(genres)),
                  },
              },
          }
        : undefined;

    const whereCondition = {
        authors: authorsCondition,
        genres: genresCondition,
    };

    const books = await context.prisma.book.findMany({
        orderBy: convertObjectToArrayOfObjects(orderBy),
        skip: paginate?.skip,
        take: paginate?.take,
        where: whereCondition,
    });

    const count = await context.prisma.book.count({ where: whereCondition });

    return {
        id: `books:` + JSON.stringify(args),
        count,
        books,
    };
}

export async function feed(
    parent,
    args,
    context: Context,
): Promise<Booklist[]> {
    const { bookCountEachCategory, categoryCount } = args;

    const feedBookLists: Booklist[] = [];
    feedBookLists.push(await getHighlightBooks(bookCountEachCategory));
    feedBookLists.push(
        // "..." spread syntax to unpack returned array elements and add then to feedBookLists array.
        ...(await getPopularGenreBasedRecommendations(
            bookCountEachCategory,
            categoryCount - 1,
        )),
    );

    return feedBookLists;
}
