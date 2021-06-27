import { UserAuthorInteraction } from "@prisma/client";
import { Context } from "../../context";

export async function user(
    parent: UserAuthorInteraction,
    args,
    context: Context,
) {
    return context.prisma.userAuthorInteraction
        .findUnique({ where: { id: parent.id } })
        .user();
}

export async function author(
    parent: UserAuthorInteraction,
    args,
    context: Context,
) {
    return context.prisma.userAuthorInteraction
        .findUnique({ where: { id: parent.id } })
        .author();
}
