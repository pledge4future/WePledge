# Endpoints

Authentication levels:

- **public**: No authentication needed
- **log_in_user**: User must be authenticated by sending valid JWT Token in header.
- **log_in_representative**: User must be authenticated and be the representative of their group.


## User management
 These mutations were implemneted using the [graphql-auth](https://django-graphql-auth.readthedocs.io/en/latest/quickstart/) packages. So they should be working.

|Name | Status| Tested | Authentication level|
|:----|-------|-------|------|
| register | :white_check_mark: | :white_check_mark: | public |
| verify_account |:white_check_mark:| :white_check_mark:| public |
| resend_activation_email | :white_check_mark: || public |
| send_password_reset_email | :white_check_mark: || public |
| password_reset | :white_check_mark: || public |
| password_set | :white_check_mark: || log_in_user |
| password_change | :white_check_mark:|| log_in_user |
| update_account | :white_check_mark: | :white_check_mark: | log_in_user |
| archive_account | :white_check_mark: || log_in_user |
| delete_account | :white_check_mark: | :white_check_mark: | log_in_user |
| send_secondary_email_activation | :white_check_mark: || log_in_user |
| verify_secondary_email | :white_check_mark: || log_in_user |
| swap_emails | :white_check_mark: || log_in_user |
| remove_secondary_email | :white_check_mark: || log_in_user |
| token_auth (Log in) | :white_check_mark: || public |
| verify_token | :white_check_mark: || public |
| refresh_token  | :white_check_mark: || public |
| revoke_token | :white_check_mark: || public |


## Working group management

|Name | Status| Tested | Authentication level|
|:----|-------|-------|------|
| create_working_group | :white_check_mark: | :white_check_mark: | log_in_user |
| update_working_group | || log_in_representative |
| set_working_group | :white_check_mark: | :white_check_mark: | log_in_user |
| institutions | :white_check_mark: | :white_check_mark:| log_in_user |
| working_groups | :white_check_mark: | :white_check_mark:| log_in_user |
| researchfields | :white_check_mark: | :white_check_mark:| log_in_user |

## Emissions

|Name | Status| Tested | Authentication level|
|:----|-------|-------|------|
| create_heating | :white_check_mark: | :white_check_mark: |log_in_representative |
| create_electricity | :white_check_mark: | :white_check_mark: |log_in_representative |
| create_businesstrip | :white_check_mark: | :white_check_mark: | log_in_user |
| create_commuting | :white_check_mark: | :white_check_mark: | log_in_user |
| resolve_businesstrips| :white_check_mark: || log_in_user |
| resolve_electricities| :white_check_mark: || log_in_user |
| resolve_heatings| :white_check_mark: || log_in_user |
| resolve_commutings| :white_check_mark: || log_in_user |
| resolve_heating_aggregated| :white_check_mark: | :white_check_mark: | log_in_user |
| resolve_electricity_aggregated|:white_check_mark: | :white_check_mark: | log_in_user |
| resolve_businesstrip_aggregated|:white_check_mark: | :white_check_mark:| log_in_user|
| resolve_commuting_aggregated| :white_check_mark:| :white_check_mark:| log_in_user |
| total_emissions | :white_check_mark:| :white_check_mark:| public |


## Optional additional endpoints

|Name | Status| Tested | Authentication level|
|:----|-------|-------|------|
| delete_heating |  | |log_in_representative |
| delete_electricity |  ||log_in_representative |
| delete_businesstrip |  || log_in_user |
| delete_commuting |  || log_in_user |
| update_heating |  | |log_in_representative |
| update_electricity |  ||log_in_representative |
| update_businesstrip |  || log_in_user |
| update_commuting |  || log_in_user |
