const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
  type Query {
    hello: String
  }

  type Subscription {
    messageAdded: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, World!',
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(['MESSAGE_ADDED']),
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

const server = new ApolloServer({
  schema,
});

server.applyMiddleware({ app });

const httpServer = createServer(app);

httpServer.listen({ port: 4000 }, () => {
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server: httpServer,
    path: server.graphqlPath,
  });
});
