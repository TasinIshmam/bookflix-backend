import { Book } from "@prisma/client";
import { Context } from "../../context";

export async function book(parent: Book, args, context: Context) {
    return context.prisma.userBookInteraction
        .findUnique({ where: { id: parent.id } })
        .book();
}

export async function user(parent: Book, args, context: Context) {
    return context.prisma.userBookInteraction
        .findUnique({ where: { id: parent.id } })
        .user();
}
