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

export const REQUEST_JOIN_WORKING_GROUP = gql`
mutation requestJoinWorkingGroup ($id: String!){
  requestJoinWorkingGroup (input: {
      workinggroupId: $id
    }
  ) {
    success
    joinRequest {
      status
      id
      workingGroup {
        id
      }
    }
  }
}
`

export const ANSWER_JOIN_REQUEST = gql`
mutation ($requestId: String!, $approve: Boolean!){
  answerJoinRequest (input: {
       approve: $approve
       requestId: $requestId
     }
     ) {
       success
       requestingUser {
          workingGroup {
             id
            }
          }
      }
  }
`

export const REMOVE_USER_FROM_WORKING_GROUP = gql`
mutation ($userID: String!){
  removeUserFromWorkingGroup (input: {
    userId: $userID
  }
  ) {
    success
  }
}
`

export const LEAVE_WORKING_GROUP = gql`
mutation{
  leaveWorkingGroup{
    success
   }
}
`


export const DELETE_WORKING_GROUP = gql`
mutation ($workingGroupId: String!){
  deleteWorkingGroup (input: {
    id: $workingGroupId
  }) {
    success
  }
}
`

export const ADD_USER_TO_WORKING_GROUP = gql`
mutation ($userEmail: String!){
  addUserToWorkingGroup (input: {
    userEmail: $userEmail
  }) {
    success
  }
}

`