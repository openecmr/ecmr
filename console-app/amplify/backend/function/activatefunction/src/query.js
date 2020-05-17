module.exports = {
  mutation: `mutation updateDriver($input: UpdateDriverInput!) {
      updateDriver(input: $input) {
        id
      }
    }`,

  listDrivers: `query DriverByAssociationSecret(
    $associationSecret: String
    $sortDirection: ModelSortDirection
    $filter: ModelDriverFilterInput
    $limit: Int
    $nextToken: String
  ) {
    driverByAssociationSecret(
      associationSecret: $associationSecret
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        name
        carrier
        associationSecret
      }
      nextToken
    }
  }`
};
