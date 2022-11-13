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