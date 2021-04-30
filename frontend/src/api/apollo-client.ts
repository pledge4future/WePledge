import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { getCookie } from "../utils/commons";


const cache = new InMemoryCache({});

const headerLink = setContext((_, { headers }) => {

  const token = getCookie("token")
        ? getCookie("token")
        : null


  return {
    headers: {
      ...headers,
      "authorization": `JWT ${token}`
      //   "Accept-Language": `${localStorage.i18nextLng}`,
    },
  };
});

const httpLink = new HttpLink({
  uri: `http://localhost:8000/graphql/`,
  credentials: "include",
});


const client = new ApolloClient({
  cache: cache,
  queryDeduplication: false,
  link: headerLink.concat(httpLink),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
  },
});

export default client;
