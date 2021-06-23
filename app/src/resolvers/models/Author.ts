import { Context } from "../../context";
import { Author } from "@prisma/client";

export async function books(parent: Author, args, context: Context) {
    return context.prisma.author
        .findUnique({ where: { id: parent.id } })
        .books();
}
