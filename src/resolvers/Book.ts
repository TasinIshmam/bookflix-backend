export async function genres(parent, args, context) {
    return context.prisma.book
        .findUnique({ where: { id: parent.id } })
        .genres();
}

export async function authors(parent, args, context) {
    return context.prisma.book
        .findUnique({ where: { id: parent.id } })
        .authors();
}

export async function UserBookInteraction(parent, args, context) {
    return [];
    //todo: Once auth is implemented, fill out.
}
