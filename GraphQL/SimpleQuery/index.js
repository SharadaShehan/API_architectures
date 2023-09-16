const { graphql, buildSchema } =  require('graphql');

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

const query = `
    {
        users {
            name
            email
        }
    }
`;

graphql({schema, source: query, rootValue})
.then((result) => {
    console.dir(result, {depth: null});
}).catch((error) => {
    console.log(error);
}
);


// response ~
// {
//     data: {
//       users: [
//         { name: 'John Doe', email: 'John6@gmail.com' },
//         { name: 'Sam Convoy', email: 'Sam7@gmail.com' }
//       ]
//     }
// }

