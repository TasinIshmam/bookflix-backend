import { rule, shield } from "graphql-shield";
import { Context } from "../../context";

// Not used at the moment.

const rules = {
    isAuthenticated: rule({ cache: false })(async (parent, args, ctx, info) => {
        return ctx.userId !== null;
    }),
};

export const permissions = shield({
    Query: {
        user: rules.isAuthenticated,
    },
    Mutation: {
        // setFavoriteGenres: rules.isAuthenticatedUser,
    },
});
