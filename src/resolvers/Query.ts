export const ping = () => "Server Running";

export async function book(parent, args, context, info) {
    const { prisma } = context;
    const { bookId } = args;

    const book = await prisma.book.findUnique({
        where: {
            id: bookId,
        },
    });

    if (!book) {
        throw new Error(`No book with bookId ${bookId}`);
    }

    return book;
}

export async function author(parent, args, context, info) {
    const { prisma } = context;
    const { authorId } = args;

    const author = await prisma.author.findUnique({
        where: {
            id: authorId,
        },
    });

    if (!author) {
        throw new Error(`No author with authorId ${authorId}`);
    }

    return author;
}
