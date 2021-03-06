import { PrismaClient, Prisma } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DATA_DIRECTORY = "prisma/seed-data-books-authors-genres";

const DELETE_PREVIOUS_RECORDS_BEFORE_SEEDING = true;

function loadSeedData(dataDirectoryPath: string): Prisma.BookCreateInput[] {
    let bookData: Prisma.BookCreateInput[] = [];
    let jsonFileArray = fs.readdirSync(dataDirectoryPath);

    for (let i = 0; i < jsonFileArray.length; i++) {
        const filePath = DATA_DIRECTORY + "/" + jsonFileArray[i];
        console.log(filePath);

        const bookArraySingleFile: Prisma.BookCreateInput[] = JSON.parse(
            fs.readFileSync(filePath) as any,
        );

        //spread syntax to destructure array elements (each individual BookCreateInput).
        bookData.push(...bookArraySingleFile);
    }

    return bookData;
}

async function deleteAllPreviousDatabaseRecords() {
    await prisma.userAuthorInteraction.deleteMany({});
    await prisma.userBookInteraction.deleteMany({});
    await prisma.favoriteGenre.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.author.deleteMany({});
    await prisma.genre.deleteMany({});
}

async function main() {
    console.log(`Start seeding ...`);
    const bookData = loadSeedData(DATA_DIRECTORY);

    if (DELETE_PREVIOUS_RECORDS_BEFORE_SEEDING) {
        console.log("DELETING all previous records.");
        await deleteAllPreviousDatabaseRecords();
    }

    for (const u of bookData) {
        try {
            const book = await prisma.book.create({
                data: u,
            });
            console.log(`Created book with book.id : ${book.id}`);
        } catch (e) {
            console.log(e);
            console.log(`Faulting Data: ${JSON.stringify(e, undefined, 4)}`);
        }
    }

    const SEED_USER: Prisma.UserCreateInput = {
        username: "seed-user",
        name: "seed-name",
        password: await bcrypt.hash("password", 10),
    };

    try {
        await prisma.user.create({ data: SEED_USER });
    } catch (e) {
        console.error("Failed to create seed user record");
        console.error(e);
    }

    console.log(`Seeding finished.`);

    console.log(`---------------Results-------------`);
    console.log(`Books in database: ${await prisma.book.count({})}`);
    console.log(`Authors in database: ${await prisma.author.count({})}`);
    console.log(`Genres in database: ${await prisma.genre.count({})}`);
    console.log(`Users in database: ${await prisma.user.count({})}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
