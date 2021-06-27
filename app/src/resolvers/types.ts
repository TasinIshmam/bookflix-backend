import { Book } from "@prisma/client";

// some manually generated types for GraphQL resolvers.
// Todo: Figure out some automated way to generate all the types.

export interface updateReadingHistoryInput {
    currentPage?: number;
    isFinishedReading?: boolean;
}

export interface Booklist {
    id: String;
    books: Book[];
    count: number;
    category?: String;
}
