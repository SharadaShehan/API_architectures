const { ApolloServer, gql } = require('apollo-server');
const crypto = require('crypto');

const fakeDB = {
    users: [
        { id: "1", name: "John Doe", email: "John6@gmail.com" },
        { id: "2", name: "Sam Convoy", email: "Sam7@gmail.com" },
    ],
    messages : [
        { id: "1", userId: "1", body: "Hello World" },
        { id: "2", userId: "2", body: "Bye World" },
        { id: "3", userId: "1", body: "Hey World" },
    ]
};

const typeDefs = gql`
    type Query {
        users: [User!]!
        messages: [Message!]!
        user(id: ID!): User
    }

    type Mutation {
        createUser(name: String!, email: String!): User
    }

    type User {
        id: ID!
        name: String!
        email: String!
        messages: [Message!]!
    }

    type Message {
        id: ID!
        body: String!
        user: User!
    }
`;

const resolvers = {
    Query: {
        users: () => fakeDB.users,
        user: (root, { id }) => fakeDB.users.find(user => user.id === id),
    },
    Mutation: {
        createUser: (root, { name, email }) => {
            const id = crypto.randomBytes(10).toString('hex');
            const newUser = { id, name, email };
            fakeDB.users.push(newUser);
            return newUser;
        }
    },
    User: {
        messages: (user) => {
            return fakeDB.messages.filter(message => message.userId === user.id);
        }
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
}
);



