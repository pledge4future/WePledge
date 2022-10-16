import { ApolloClient, InMemoryCache, HttpLink} from "@apollo/client";
import {setContext} from '@apollo/client/link/context';
import { getCookie } from "../utils/commons";


const cache = new InMemoryCache({});

const headerLink = setContext((_, { headers }) => {

  const token = getCookie("token")
        ? getCookie("token")
        : null


  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : ''
      //   "Accept-Language": `${localStorage.i18nextLng}`,
    },
  };
});

const httpLink = new HttpLink({
  uri: JSON.parse(process.env.NEXT_PUBLIC_DEV) ? `http://localhost:8000/graphql/` : `https://api.test-pledge4future.heigit.org/graphql/`
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
