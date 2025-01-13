import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:4000/books',  // آدرس سرور GraphQL شما
    }),
    cache: new InMemoryCache(),
});

export default client;
