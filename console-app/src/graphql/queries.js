// eslint-disable
// this is an auto generated file. This will be overwritten

export const getContract = `query GetContract($id: ID!) {
  getContract(id: $id) {
    id
    owner
    carrierUsername
    status
    shipper {
      name
      postalCode
      address
      city
      country
    }
    carrier {
      name
      postalCode
      address
      city
      country
    }
    delivery {
      name
      postalCode
      address
      city
      country
    }
    arrivalDate
    deliveryDate
    pickup {
      name
      postalCode
      address
      city
      country
    }
    loads {
      category
      quantity
      description
    }
    driver {
      name
    }
    trailer
    truck
    references {
      carrier
    }
    updatedAt
    createdAt
    events {
      author {
        username
      }
      type
      site
      createdAt
      latitude
      longitude
    }
  }
}
`;
export const listContracts = `query ListContracts(
  $filter: ModelContractFilterInput
  $limit: Int
  $nextToken: String
) {
  listContracts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      owner
      carrierUsername
      status
      shipper {
        name
        postalCode
        address
        city
        country
      }
      carrier {
        name
        postalCode
        address
        city
        country
      }
      delivery {
        name
        postalCode
        address
        city
        country
      }
      arrivalDate
      deliveryDate
      pickup {
        name
        postalCode
        address
        city
        country
      }
      loads {
        category
        quantity
        description
      }
      driver {
        name
      }
      trailer
      truck
      references {
        carrier
      }
      updatedAt
      createdAt
      events {
        author {
          username
        }
        type
        site
        createdAt
        latitude
        longitude
      }
    }
    nextToken
  }
}
`;
