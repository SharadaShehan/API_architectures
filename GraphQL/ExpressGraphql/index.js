const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');


const fakeDB = {
    users: [
        { id: "1", name: "John Doe", email: "John6@gmail.com" },
        { id: "2", name: "Sam Convoy", email: "Sam7@gmail.com" },
    ]
};

const schema = buildSchema(`
    type Query {
        users: [User!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
    }
`);

const rootValue = {
    users: () => {
        return fakeDB.users;
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

