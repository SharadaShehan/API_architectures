const { createClient } = require('graphql-ws');

const client = createClient({
  url: 'ws://localhost:4000/graphql',
});

client.subscribe({
  query: `
    subscription {
      messageAdded
    }
  `,
}, {
  next: (data) => {
    console.log('Received:', data.data.messageAdded);
  },
  complete: () => {
    console.log('Subscription complete');
  },
});

// For sending messages to the server
// client.mutate({ mutation: '...', variables: { /* ... */ } });
