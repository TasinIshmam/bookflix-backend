import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

//  type BookCreateInput = {
//     createdAt?: Date | string
//     title: string
//     copyright?: boolean
//     language?: string
//     updatedAt?: Date | string
//     fileUrl: string
//     fileType: string
//     coverImageUrl?: string | null
//     authors?: AuthorCreateNestedManyWithoutBooksInput
//     genres?: GenreCreateNestedManyWithoutBooksInput
// }

// type AuthorCreateInput = {
//     name: string
//     birthYear?: number | null
//     deathYear?: number | null
//     createdAt?: Date | string
// }

// type GenreCreateWithoutBooksInput = {
//     name: string
// }

const bookData: Prisma.BookCreateInput[] = [
    {
        //each entry of type BookCreateInput
        title: "Book-1-Title",
        copyright: false,
        fileUrl: "url/Book-1-Title",
        fileType: "pdf",
        coverImageUrl: "url/coverImage1",
        authors: {
            connectOrCreate: [
                {
                    where: {
                        name: "Author1",
                    },
                    create: {
                        // AuthorCreateInput type
                        name: "Author1",
                        birthYear: 1920,
                        deathYear: 2002,
                    },
                },

                {
                    where: {
                        name: "Author2",
                    },
                    create: {
                        name: "Author2",
                        birthYear: 1924,
                        deathYear: 2000,
                    },
                },
            ],
        },

        genres: {
            connectOrCreate: [
                {
                    where: { name: "genre-1" },
                    create: { name: "genre-1" },
                },
                {
                    where: { name: "genre-2" },
                    create: { name: "genre-2" }, // GenreCreateWithoutBooksInput type
                },
            ],
        },
    },

    {
        title: "Book-2-Title",
        copyright: true,
        fileUrl: "url/Book-2-Title",
        fileType: "pdf",
        coverImageUrl: "url/coverImage2",
        authors: {
            connectOrCreate: [
                {
                    where: {
                        name: "Author3",
                    },
                    create: {
                        name: "Author3",
                    },
                },

                {
                    where: {
                        name: "Author2",
                    },
                    create: {
                        name: "Author2",
                        birthYear: 1924,
                        deathYear: 2000,
                    },
                },
            ],
        },

        genres: {
            connectOrCreate: [
                {
                    where: { name: "genre-2" },
                    create: { name: "genre-2" },
                },
                {
                    where: { name: "genre-4" },
                    create: { name: "genre-4" },
                },
            ],
        },
    },

    {
        title: "Book-3-Title",
        copyright: true,
        fileUrl: "url/Book-3-Title",
        fileType: "epub",
        authors: {
            connectOrCreate: [
                {
                    where: {
                        name: "Author5",
                    },
                    create: {
                        name: "Author5",
                    },
                },

                {
                    where: {
                        name: "Author2",
                    },
                    create: {
                        name: "Author2",
                        birthYear: 1999,
                        deathYear: 2000,
                    },
                },
            ],
        },

        genres: {
            connectOrCreate: [
                //example of no related genres. If no authors are added, can be similarly empty.
            ],
        },
    },
];

async function main() {
    console.log(`Start seeding ...`);
    for (const u of bookData) {
        const book = await prisma.book.create({
            data: u,
        });
        console.log(`Created book with id: ${book.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
