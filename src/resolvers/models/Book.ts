import { Context } from "../../context";
import { Book } from "@prisma/client";
import { AuthenticationError } from "apollo-server-errors";

export async function genres(parent: Book, args, context: Context) {
    return context.prisma.book
        .findUnique({ where: { id: parent.id } })
        .genres();
}

export async function authors(parent: Book, args, context: Context) {
    return context.prisma.book
        .findUnique({ where: { id: parent.id } })
        .authors();
}

export async function UserBookInteraction(
    parent: Book,
    args,
    context: Context,
) {
    const { userId } = context;
    if (!userId)
        throw new AuthenticationError(
            "Unable to access UserBookInteraction. Not logged in",
        );

    return context.prisma.userBookInteraction.findUnique({
        where: {
            bookId_userId: {
                bookId: parent.id,
                userId: userId,
            },
        },
    });
}
