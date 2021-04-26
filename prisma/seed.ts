import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const bookData: Prisma.BookCreateInput[] = [
    {
        title: "Frankenstein; Or, The Modern Prometheus",
        copyright: false,
        fileUrl: "books/84.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/84.epub.images.png",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Shelley, Mary Wollstonecraft" },
                    create: {
                        name: "Shelley, Mary Wollstonecraft",
                        birthYear: 1797,
                        deathYear: 1851,
                    },
                },
            ],
        },
        genres: {
            connectOrCreate: [
                {
                    where: { name: "Gothic Fiction" },
                    create: { name: "Gothic Fiction" },
                },
                {
                    where: { name: "Movie Books" },
                    create: { name: "Movie Books" },
                },
                {
                    where: { name: "Precursors of Science Fiction" },
                    create: { name: "Precursors of Science Fiction" },
                },
                {
                    where: { name: "Science Fiction by Women" },
                    create: { name: "Science Fiction by Women" },
                },
            ],
        },
    },
    {
        title: "Pride and Prejudice",
        copyright: false,
        fileUrl: "books/1342.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/1342.epub.images.jpeg",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Austen, Jane" },
                    create: {
                        name: "Austen, Jane",
                        birthYear: 1775,
                        deathYear: 1817,
                    },
                },
            ],
        },
        genres: {
            connectOrCreate: [
                {
                    where: { name: "Best Books Ever Listings" },
                    create: { name: "Best Books Ever Listings" },
                },
                {
                    where: { name: "Harvard Classics" },
                    create: { name: "Harvard Classics" },
                },
            ],
        },
    },
    {
        title: "The Great Gatsby",
        copyright: false,
        fileUrl: "books/64317.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/64317.epub.images.jpeg",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Fitzgerald, F. Scott (Francis Scott)" },
                    create: {
                        name: "Fitzgerald, F. Scott (Francis Scott)",
                        birthYear: 1896,
                        deathYear: 1940,
                    },
                },
            ],
        },
        genres: { connectOrCreate: [] },
    },
    {
        title: "Alice's Adventures in Wonderland",
        copyright: false,
        fileUrl: "books/11.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/11.epub.images.jpeg",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Carroll, Lewis" },
                    create: {
                        name: "Carroll, Lewis",
                        birthYear: 1832,
                        deathYear: 1898,
                    },
                },
            ],
        },
        genres: {
            connectOrCreate: [
                {
                    where: { name: "Children's Literature" },
                    create: { name: "Children's Literature" },
                },
            ],
        },
    },
    {
        title: "A Tale of Two Cities",
        copyright: false,
        fileUrl: "books/98.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/98.epub.images.png",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Dickens, Charles" },
                    create: {
                        name: "Dickens, Charles",
                        birthYear: 1812,
                        deathYear: 1870,
                    },
                },
            ],
        },
        genres: {
            connectOrCreate: [
                {
                    where: { name: "Historical Fiction" },
                    create: { name: "Historical Fiction" },
                },
            ],
        },
    },
    {
        title:
            "A Modest Proposal: For preventing the children of poor people in Ireland, from being a burden on their parents or country, and for making them beneficial to the publick",
        copyright: false,
        fileUrl: "books/1080.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/1080.epub.images.png",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Swift, Jonathan" },
                    create: {
                        name: "Swift, Jonathan",
                        birthYear: 1667,
                        deathYear: 1745,
                    },
                },
            ],
        },
        genres: { connectOrCreate: [] },
    },
    {
        title: "A Doll's House : a play",
        copyright: false,
        fileUrl: "books/2542.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/2542.epub.images.png",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Ibsen, Henrik" },
                    create: {
                        name: "Ibsen, Henrik",
                        birthYear: 1828,
                        deathYear: 1906,
                    },
                },
            ],
        },
        genres: {
            connectOrCreate: [
                {
                    where: { name: "Best Books Ever Listings" },
                    create: { name: "Best Books Ever Listings" },
                },
            ],
        },
    },
    {
        title:
            "The Importance of Being Earnest: A Trivial Comedy for Serious People",
        copyright: false,
        fileUrl: "books/844.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/844.epub.images.png",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Wilde, Oscar" },
                    create: {
                        name: "Wilde, Oscar",
                        birthYear: 1854,
                        deathYear: 1900,
                    },
                },
            ],
        },
        genres: {
            connectOrCreate: [
                { where: { name: "Plays" }, create: { name: "Plays" } },
            ],
        },
    },
    {
        title: "The Yellow Wallpaper",
        copyright: false,
        fileUrl: "books/1952.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/1952.epub.images.jpeg",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Gilman, Charlotte Perkins" },
                    create: {
                        name: "Gilman, Charlotte Perkins",
                        birthYear: 1860,
                        deathYear: 1935,
                    },
                },
            ],
        },
        genres: {
            connectOrCreate: [
                {
                    where: { name: "Gothic Fiction" },
                    create: { name: "Gothic Fiction" },
                },
            ],
        },
    },
    {
        title: "Metamorphosis",
        copyright: true,
        fileUrl: "books/5200.epub.images",
        fileType: "epub",
        coverImageUrl: "book-covers/5200.epub.images.png",
        authors: {
            connectOrCreate: [
                {
                    where: { name: "Kafka, Franz" },
                    create: {
                        name: "Kafka, Franz",
                        birthYear: 1883,
                        deathYear: 1924,
                    },
                },
            ],
        },
        genres: {
            connectOrCreate: [
                { where: { name: "Horror" }, create: { name: "Horror" } },
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

const bookData2: Prisma.BookCreateInput[] = [
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
