import { PrismaClient } from "@prisma/client";
import { Booklist } from "../../resolvers/types";
import { Context } from "../../context";
import logger from "../../utils/logger";
import { convertObjectToArrayOfObjects, shuffle } from "../../utils/misc";
import { favoriteAuthors } from "../../resolvers/models/User";

/**
 * Returns books for the hero section. Currently returns the highest rated n books.
 * @param bookCount Number of books to return
 * @param context provides prisma instance
 */
export async function getHighlightBooks(
    bookCount: number,
    context: Context,
): Promise<Booklist> {
    const books = await context.prisma.book.findMany({
        orderBy: {
            rating: "desc",
        },
        where: {
            NOT: {
                rating: null,
            },
        },
        take: bookCount,
    });

    return {
        id: `highlight-${bookCount}`,
        books: shuffle(books),
        count: bookCount,
        category: "Top Picks",
    };
}

/**
 * Returns genre specific recommendations.
 * Genres chosen based on number of books in that genre.
 * @param categoryCount Number of genres to return
 * @param bookCountEachCategory Number of books to return for each genre. (Might be less if the genre does not support this many books).
 * @param context provides prisma instance
 */
export async function getPopularGenreBasedRecommendations(
    bookCountEachCategory: number,
    categoryCount: number,
    context: Context,
): Promise<Booklist[]> {
    // get a number of genres
    const genres = await context.prisma.genre.findMany({
        take: categoryCount,
        orderBy: {
            books: {
                count: "desc",
            },
        },
        include: {
            books: true,
        },
    });
    // shuffle order
    let shuffledGenres = shuffle(genres);

    // get a booklist for each genre.
    const genreBasedBookLists: Booklist[] = shuffledGenres
        .map((genreWithBooks) => {
            let numberOfBooksToTake = Math.min(
                bookCountEachCategory,
                genreWithBooks.books.length,
            );

            return {
                id: `genre-${genreWithBooks.name}-${bookCountEachCategory}`,
                books: shuffle(
                    genreWithBooks.books.slice(0, numberOfBooksToTake),
                ), // return books in random order
                count: numberOfBooksToTake,
                category: `Try books of genre: ${genreWithBooks.name}`,
            };
        })
        .filter((bookListEntry: Booklist) => {
            return bookListEntry.books.length !== 0;
        });

    return genreBasedBookLists;
}

/**
 * Get books that the user has started reading (but not finished).
 * Order is randomized
 * @param bookCount Maximum number of books to return.
 * @param context provides userId and Prisma instance
 */
export async function getBooksThatUserIsCurrentlyReading(
    bookCount: number,
    context: Context,
): Promise<Booklist> {
    const { userId } = context;

    const currentlyReading = await context.prisma.userBookInteraction.findMany({
        where: {
            userId: userId,
            isFinishedReading: false,
            currentPage: {
                gt: 1,
            },
        },
        select: { bookId: true },
    });

    // Convert syntax. Eg: [ { bookId: 6 }, { bookId: 5 } ]  =>  [ 6, 5 ]
    const bookIdArray = currentlyReading.map(
        (interaction) => interaction.bookId,
    );

    //generate search condition
    const bookSearchCondition = { id: { in: bookIdArray } };

    const books = await context.prisma.book.findMany({
        where: bookSearchCondition,
    });

    let numberOfBooksToTake = Math.min(bookCount, books.length);
    // shuffle books and take bookCount number of them.
    let shuffledBooks = shuffle(books).slice(0, numberOfBooksToTake);

    return {
        id: `currentlyReading-${userId}-${bookCount}`,
        books: shuffledBooks,
        count: numberOfBooksToTake,
        category: `Continue reading:`,
    };
}

export async function getBooksByUsersFavoriteAuthors(
    bookCountEachCategory: number,
    context: Context,
): Promise<Booklist[]> {
    // shape of return type:  [{ author: { name: "String", books: Book[]}}]
    let favoriteAuthorsAndBooks = await context.prisma.userAuthorInteraction.findMany(
        {
            where: {
                userId: context.userId,
                isFavorite: true,
            },
            select: {
                author: {
                    select: {
                        name: true,
                        books: true,
                    },
                },
            },
        },
    );

    favoriteAuthorsAndBooks = shuffle(favoriteAuthorsAndBooks);

    const favoriteAuthorBasedBooklists: Booklist[] = favoriteAuthorsAndBooks.map(
        ({ author }) => {
            let numberOfBooksToTake = Math.min(
                bookCountEachCategory,
                author.books.length,
            );

            const authorName = author.name;
            const shuffledBooks = shuffle(author.books).slice(
                0,
                numberOfBooksToTake,
            );

            return {
                id: `favoriteAuthor-${authorName}-${context.userId}-${bookCountEachCategory}`,
                books: shuffledBooks,
                count: numberOfBooksToTake,
                category: `More from your favorite Author ${authorName}`,
            };
        },
    );

    return favoriteAuthorBasedBooklists;
}
