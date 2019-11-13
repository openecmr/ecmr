/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getContract = `query GetContract($id: ID!) {
  getContract(id: $id) {
    id
    owner
    carrierUsername
    status
    shipper {
      id
      owner
      name
      postalCode
      address
      city
      country
    }
    carrier {
      id
      owner
      name
      postalCode
      address
      city
      country
    }
    delivery {
      id
      owner
      name
      postalCode
      address
      city
      country
    }
    arrivalDate
    deliveryDate
    pickup {
      id
      owner
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
      signature {
        method
        signatureImageDriver {
          bucket
          region
          key
        }
        signatureImageSignatory {
          bucket
          region
          key
        }
      }
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
        id
        owner
        name
        postalCode
        address
        city
        country
      }
      carrier {
        id
        owner
        name
        postalCode
        address
        city
        country
      }
      delivery {
        id
        owner
        name
        postalCode
        address
        city
        country
      }
      arrivalDate
      deliveryDate
      pickup {
        id
        owner
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
        signature {
          method
          signatureImageDriver {
            bucket
            region
            key
          }
          signatureImageSignatory {
            bucket
            region
            key
          }
        }
      }
    }
    nextToken
  }
}
`;
export const getContact = `query GetContact($id: ID!) {
  getContact(id: $id) {
    id
    owner
    name
    postalCode
    address
    city
    country
  }
}
`;
export const listContacts = `query ListContacts(
  $filter: ModelContactFilterInput
  $limit: Int
  $nextToken: String
) {
  listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      owner
      name
      postalCode
      address
      city
      country
    }
    nextToken
  }
}
`;
