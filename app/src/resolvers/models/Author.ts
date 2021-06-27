import { Context, prisma } from "../../context";
import { Author } from "@prisma/client";
import { AuthenticationError } from "apollo-server-errors";

export async function books(parent: Author, args, context: Context) {
    return context.prisma.author
        .findUnique({ where: { id: parent.id } })
        .books();
}

export async function isLikedByUser(parent: Author, args, context: Context) {
    const { userId } = context;
    if (!userId) throw new AuthenticationError("Not logged in");

    const userAuthorInteraction = await context.prisma.userAuthorInteraction.findUnique(
        {
            where: {
                authorId_userId: {
                    authorId: parent.id,
                    userId: userId
                }
            }
        }
    )
    return userAuthorInteraction? userAuthorInteraction.isFavorite : false;
}