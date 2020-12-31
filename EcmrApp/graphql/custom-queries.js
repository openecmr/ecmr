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

export const companyByOwner = /* GraphQL */ `
  query CompanyByOwner(
    $owner: String
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCompanyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    companyByOwner(
      owner: $owner
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;