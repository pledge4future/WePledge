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
    }
  }
`