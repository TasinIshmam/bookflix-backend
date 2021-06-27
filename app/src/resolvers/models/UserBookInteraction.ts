import { UserBookInteraction } from "@prisma/client";
import { Context } from "../../context";

export async function book(
    parent: UserBookInteraction,
    args,
    context: Context,
) {
    return context.prisma.userBookInteraction
        .findUnique({ where: { id: parent.id } })
        .book();
}

export async function user(
    parent: UserBookInteraction,
    args,
    context: Context,
) {
    return context.prisma.userBookInteraction
        .findUnique({ where: { id: parent.id } })
        .user();
}
