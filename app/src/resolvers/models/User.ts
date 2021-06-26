import { Author, User } from "@prisma/client";
import { Context } from "../../context";
import { userBookInteraction } from "../Query";
import internal from "stream";

export async function bookInteractions(parent: User, args, context: Context) {
    return context.prisma.user
        .findUnique({ where: { id: parent.id } })
        .readingHistories();
}

export async function favoriteGenres(parent: User, args, context: Context) {
    return context.prisma.user
        .findUnique({ where: { id: parent.id } })
        .favoriteGenres();
}

export async function favoriteAuthors(parent: User, args, context: Context) {
    let userAuthorInteractions = await context.prisma.userAuthorInteraction.findMany(
        {
            where: {
                userId: parent.id,
                isFavorite: true,
            },
            include: {
                author: true,
            },
        },
    );

    let favoriteAuthors = userAuthorInteractions.map((interaction) => {
        return interaction.author;
    });
    return favoriteAuthors;
}
