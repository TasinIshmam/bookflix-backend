import { Booklist } from "../../resolvers/types";
import { Context } from "../../context";
import logger from "../../utils/logger";
import { convertObjectToArrayOfObjects, shuffle } from "../../utils/misc";
import config from "../../config/config";

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
        id: `feed-highlight-${bookCount}`,
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
                id: `feed-genre-${genreWithBooks.name}-${bookCountEachCategory}`,
                books: shuffle(
                    genreWithBooks.books.slice(0, numberOfBooksToTake),
                ), // return books in random order
                count: numberOfBooksToTake,
                category: `Try ${genreWithBooks.name} books`,
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
            NOT: [
                {
                    currentPageLocation: null,
                },
            ],
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
        id: `feed-currentlyReading-${userId}-${bookCount}`,
        books: shuffledBooks,
        count: numberOfBooksToTake,
        category: `Continue reading:`,
    };
}

/**
 * Get books from user's favorite list.
 * Order is randomized
 * @param bookCount Maximum number of books to return.
 * @param context provides userId and Prisma instance
 */
export async function getFavoriteBooks(
    bookCount: number,
    context: Context,
): Promise<Booklist> {
    const { userId } = context;

    const favoriteBooks = await context.prisma.userBookInteraction.findMany({
        where: {
            userId: userId,
            isFavorite: true,
        },
        select: {
            book: true,
        },
    });

    // change shape of array
    const books = favoriteBooks.map(({ book }) => book);

    let numberOfBooksToTake = Math.min(bookCount, books.length);
    // shuffle books and take bookCount number of them.
    let shuffledBooks = shuffle(books).slice(0, numberOfBooksToTake);

    return {
        id: `feed-favoriteBooks-${userId}-${bookCount}`,
        books: shuffledBooks,
        count: numberOfBooksToTake,
        category: `Go through your favorites`,
    };
}

/**
 * Get books that the user has marked to read later.
 * Order is randomized
 * @param bookCount Maximum number of books to return.
 * @param context provides userId and Prisma instance
 */
export async function getBooksMarkedReadLater(
    bookCount: number,
    context: Context,
): Promise<Booklist> {
    const { userId } = context;

    const readLaterBooks = await context.prisma.userBookInteraction.findMany({
        where: {
            userId: userId,
            isOnReadLaterList: true,
        },
        select: {
            book: true,
        },
    });

    const books = readLaterBooks.map(({ book }) => book);

    let numberOfBooksToTake = Math.min(bookCount, books.length);
    // shuffle books and take bookCount number of them.
    let shuffledBooks = shuffle(books).slice(0, numberOfBooksToTake);

    return {
        id: `feed-readLater-${userId}-${bookCount}`,
        books: shuffledBooks,
        count: numberOfBooksToTake,
        category: `Check out the books you wanted to read later`,
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
                id: `feed-favoriteAuthor-${authorName}-${context.userId}-${bookCountEachCategory}`,
                books: shuffledBooks,
                count: numberOfBooksToTake,
                category: `More from your favorite Author ${authorName}`,
            };
        },
    );

    return favoriteAuthorBasedBooklists;
}

export async function getBooksFromUsersFavoriteGenres(
    bookCountEachCategory: number,
    context: Context,
): Promise<Booklist[]> {
    // shape of return type:  [{ author: { name: "String", books: Book[]}}]
    let favoriteGenresAndBooks = await context.prisma.favoriteGenre.findMany({
        where: {
            userId: context.userId,
        },
        select: {
            genre: {
                select: {
                    name: true,
                    books: true,
                },
            },
        },
    });

    favoriteGenresAndBooks = shuffle(favoriteGenresAndBooks);

    const favoriteGenreBasedBookLists: Booklist[] = favoriteGenresAndBooks.map(
        ({ genre }) => {
            let numberOfBooksToTake = Math.min(
                bookCountEachCategory,
                genre.books.length,
            );

            const genreName = genre.name;
            const shuffledBooks = shuffle(genre.books).slice(
                0,
                numberOfBooksToTake,
            );

            return {
                id: `feed-genre-${genreName}-${bookCountEachCategory}`,
                books: shuffledBooks,
                count: numberOfBooksToTake,
                category: `Because you like ${genreName}`,
            };
        },
    );

    return favoriteGenreBasedBookLists;
}

export async function generateFeedBookLists(
    bookCountEachCategory: number,
    categoryCount: number,
    context: Context,
) {
    let feedBookLists: Booklist[] = [];

    feedBookLists.push(await getFavoriteBooks(bookCountEachCategory, context));

    feedBookLists.push(
        await getBooksMarkedReadLater(bookCountEachCategory, context),
    );

    feedBookLists.push(
        ...(await getBooksByUsersFavoriteAuthors(
            bookCountEachCategory,
            context,
        )),
    );

    feedBookLists.push(
        ...(await getBooksFromUsersFavoriteGenres(
            bookCountEachCategory,
            context,
        )),
    );

    const numberOfCategoriesLeft =
        categoryCount +
        config.feed.extraCategoriesForRandomization -
        feedBookLists.length;

    const genreBasedBooksToTake = Math.max(
        numberOfCategoriesLeft,
        config.feed.maxGenreBasedLists,
    );

    feedBookLists.push(
        // "..." spread syntax to unpack returned array elements and add then to feedBookLists array.
        ...(await getPopularGenreBasedRecommendations(
            bookCountEachCategory,
            genreBasedBooksToTake,
            context,
        )),
    );

    let numberOfCategories = Math.min(categoryCount, feedBookLists.length);

    // randomize and take first $numberOfCategories categories.
    return shuffle(feedBookLists).slice(0, numberOfCategories);
}
