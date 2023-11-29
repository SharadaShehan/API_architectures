const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
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

const schema = buildSchema(`
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
`);

class User {
    constructor(user) {
        Object.assign(this, user);
    }

    messages() {
        return fakeDB.messages.filter(message => message.userId === this.id);
    }
}

const rootValue = {
    users: () => {
        return fakeDB.users.map(user => new User(user));
    },
    user: ({ id }) => {
        return new User(fakeDB.users.find(user => user.id === id));
    },
    createUser: ({ name, email }) => {
        const id = crypto.randomBytes(10).toString('hex');
        const newUser = { id, name, email };
        fakeDB.users.push(newUser);
        return newUser;
    }
};



const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
})
);

app.listen(3000, () => { console.log('Server is running on port 3000')});

