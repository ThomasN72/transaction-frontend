import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql", // Update with your NestJS backend URL
  cache: new InMemoryCache(),
});

export default client;
