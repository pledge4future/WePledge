import { gql } from "@apollo/client";

export const getUserProfile = gql`
  query {
    me {
    email
    verified
    workingGroup {
      id
      name
    }
  }
}
`