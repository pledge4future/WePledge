import { gql } from "@apollo/client";


export const getInstitutions = gql`
    query {
        institutions {
        id
        name
        city
        country
        }
    }
  `

export const getResearchFields = gql`
    query {
        researchfields {
        id
        field
        subfield
        }
    }
`

export const getWorkingGroups = gql`
query {
    workinggroups {
      id
      name
      field {
        field
        subfield
      }
      institution {
        id
        name
        city
        country
      }
    }
  }
`

export const getWorkingGroupUsers = gql`
query {
  workinggroupUsers {
    id
    email
    firstName
    lastName
  }
}
`

export const resolveWorkingGroupJoinRequests = gql`
query {
  joinRequests {
    id
    status
    timestamp
    user {
      email
      firstName
      lastName
    }
  }
}
`
