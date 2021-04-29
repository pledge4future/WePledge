import { gql } from "@apollo/client";
export const user = gql`
  query getUser {
    user(id: 3) {
      id
      username
      firstName
      lastName
      email
      password
      businesstripSet {
        co2e
      }
    }
  }
`;
