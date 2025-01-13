const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

mongoose.connect('mongodb://127.0.0.1/testBook', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB successfully!'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    const app = express();
    server.applyMiddleware({ app, path: '/books' });
    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at http://localhost:4000/books`)
    );
}

startServer();
