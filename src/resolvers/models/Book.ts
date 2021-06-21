import { Context } from "../../context";
import { Book } from "@prisma/client";

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
    return [];
    //todo: Once auth is implemented, fill out.
}
