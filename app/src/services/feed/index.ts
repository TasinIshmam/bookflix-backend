import { PrismaClient } from "@prisma/client";
import { Booklist } from "../../resolvers/types";
import { prisma } from "../../context";
import logger from "../../utils/logger";
import { shuffle } from "../../utils/misc";

/**
 * Returns books for the hero section. Currently returns the highest rated n books.
 * @param count Number of books to return
 */
export async function getHighlightBooks(count: number): Promise<Booklist> {
    const books = await prisma.book.findMany({
        orderBy: {
            rating: "desc",
        },
        where: {
            NOT: {
                rating: null,
            },
        },
        take: count,
    });

    return {
        id: `highlight-${count}`,
        books: shuffle(books),
        count: count,
        category: "Top Picks",
    };
}

/**
 * Returns genre specific recommendations.
 * Genres chosen based on number of books in that genre.
 * @param categoryCount Number of genres to return
 * @param bookCountEachCategory Number of books to return for each genre. (Might be less if the genre does not support this many books).
 */
export async function getPopularGenreBasedRecommendations(
    bookCountEachCategory: number,
    categoryCount: number,
): Promise<Booklist[]> {
    const genres = await prisma.genre.findMany({
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
    // logger.debug(JSON.stringify(genres, undefined, 4));
    let shuffledGenres = shuffle(genres);

    const genreBasedBookLists: Booklist[] = shuffledGenres.map(
        (genreWithBooks) => {
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
        },
    );

    return genreBasedBookLists;
}