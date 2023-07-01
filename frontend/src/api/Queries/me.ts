import { gql } from "@apollo/client";

export const getUserProfile = gql`
  query {
    me {
    email
    verified
    firstName
    lastName
    isRepresentative
    workingGroup {
      id
      name
      nEmployees
      institution {
        name 
        city
        state
        country
      }
      field {
        field
        subfield
      }
    }
  }
}
`