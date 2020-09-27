export const contactPersonByContact = `
  query ContactPersonByContact(
    $contactId: ID
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContactPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contactPersonByContact(
      contactId: $contactId
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        email
        phone
      }
      nextToken
    }
  }
`;