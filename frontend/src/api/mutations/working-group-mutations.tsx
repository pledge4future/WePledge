import { gql } from "@apollo/client";

export const CREATE_WORKING_GROUP = gql`
mutation createWorkingGroup($name: String!, $institution: String!, $city: String!, $country: String!, $field: String!, $subField: String!, $nEmployees: Int!, $is_public: Boolean!){
    createWorkingGroup (input: {
        name: $name
        institution: $institution
        city: $city
        country: $country
        field: $field
        subfield: $subField
        nEmployees: $nEmployees
        isPublic: $is_public
    }) {
        workinggroup {
            name
            representative {
                username
            }
    }
    }
}
`