module.exports = {
  mutation: `mutation updateDriver($input: UpdateDriverInput!) {
      updateDriver(input: $input) {
        id
      }
    }`,

  listDrivers: `query listDrivers($filter: ModelDriverFilterInput) {
      listDrivers(filter: $filter) {
        items {
          id
          owner
          name
          carrier
          associationSecret
        }
      }
    }`
};
