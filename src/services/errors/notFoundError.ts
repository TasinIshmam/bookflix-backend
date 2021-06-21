import { ApolloError } from "apollo-server-errors";

export class NotFoundError extends ApolloError {
    constructor(message: string) {
        super(message, "DATA_NOT_FOUND");
        // Object.defineProperty(this, "name", { value: "MyError" });
    }
}
