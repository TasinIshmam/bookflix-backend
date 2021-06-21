import { Context } from "../context";
import { AuthenticationError } from "apollo-server-errors";
import { NotFoundError } from "../services/errors/notFoundError";
import { convertObjectToArrayOfObjects } from "../utils/misc";

export const ping = () => "Server Running";

export async function book(parent, args, context: Context, info) {
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

export async function author(parent, args, context: Context, info) {
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

export async function user(parent, args, context: Context, info) {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");

    return context.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
}

export async function search(parent, args, context: Context, info) {
    const where = args.filter
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
              ],
          }
        : {};

    // optional chaining syntax used for skip and take. Ref: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
    const results = await context.prisma.book.findMany({
        where,
        orderBy: convertObjectToArrayOfObjects(args.orderBy),
        skip: args.paginate?.skip,
        take: args.paginate?.take,
    });

    const count = await context.prisma.book.count({ where });

    return {
        id: "search-" + JSON.stringify(args),
        books: results,
        count,
    };
}
