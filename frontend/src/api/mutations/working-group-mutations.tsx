import { gql } from "@apollo/client";

export const CREATE_WORKING_GROUP = gql`
mutation createWorkingGroup($name: String!, $institution: String!, $field: Int!, $nEmployees: Int!, $is_public: Boolean!){
    createWorkingGroup (input: {
        name: $name
        institutionId: $institution
        researchFieldId: $field
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