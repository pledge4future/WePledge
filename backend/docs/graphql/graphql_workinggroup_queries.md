## GraphQL: WorkingGroup

### Query working groups

#### Request

``` graphql
query {
	workingGroups {
	 name
    groupId
  }
}
```

#### Response

``` json
{
  "data": {
    "workingGroups": [
      {
        "name": "Environmental Research Group",
        "groupId": "27149d4f-d15d-466f-a842-21ae11b3a49e"
      },
      {
        "name": "Biomedical Research Group",
        "groupId": "7e6a9528-0a71-4472-9090-2ca34aa135bb"
      }
    ]
  }
}
```
