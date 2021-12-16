# Endpoints


|Name | Status| Tested | Auth level|
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
| create_working_group ||| log_in_user |
| update_working_group ||| log_in_representative |
| change_working_group ||| log_in_user |
| change_representative ||| log_in_representative |
| institutions ||| log_in_user |
| institution_options ||| log_in_user |
| working_groups ||| log_in_user |
| users ||| log_in_representative (wg)|
| create_heating | :white_check_mark: ||log_in_representative |
| create_electricity | :white_check_mark: ||log_in_representative |
| create_businesstrip | :white_check_mark: || log_in_user |
| create_commuting | :white_check_mark: || log_in_user |
| delete_heating |  | |log_in_representative |
| delete_electricity |  ||log_in_representative |
| delete_businesstrip |  || log_in_user |
| delete_commuting |  || log_in_user |
| update_heating |  | |log_in_representative |
| update_electricity |  ||log_in_representative |
| update_businesstrip |  || log_in_user |
| update_commuting |  || log_in_user |
| resolve_businesstrips| :white_check_mark: || log_in_user (own)|
| resolve_electricities| :white_check_mark: || log_in_user (group)|
| resolve_heatings| :white_check_mark: || log_in_user (group)|
| resolve_commutings| :white_check_mark: || log_in_user (own)|
| resolve_heating_aggregated| :white_check_mark: || log_in_user (group)|
| resolve_electricity_aggregated|:white_check_mark: || log_in_user (group)|
| resolve_businesstrip_aggregated|:white_check_mark: || log_in_user (group)|
| resolve_commuting_aggregated| :white_check_mark:|| log_in_user (group)|
| [overall_emissions](./data/overall_emissions.md) | :eight_pointed_black_star:|||
|||||
|||||
|||||
