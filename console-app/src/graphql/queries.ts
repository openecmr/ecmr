// tslint:disable
// this is an auto generated file. This will be overwritten

export const getContract = `query GetContract($id: ID!) {
  getContract(id: $id) {
    id
    sequentialId
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
    vehicle {
      trailer
      truck
    }
    references {
      carrier
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
      sequentialId
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
      vehicle {
        trailer
        truck
      }
      references {
        carrier
      }
    }
    nextToken
  }
}
`;
