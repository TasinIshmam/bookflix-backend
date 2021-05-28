export async function books(parent, args, context) {
    return context.prisma.author
        .findUnique({ where: { id: parent.id } })
        .books();
}
