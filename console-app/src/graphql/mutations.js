/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createContract = `mutation CreateContract($input: CreateContractInput!) {
  createContract(input: $input) {
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
export const updateContract = `mutation UpdateContract($input: UpdateContractInput!) {
  updateContract(input: $input) {
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
export const deleteContract = `mutation DeleteContract($input: DeleteContractInput!) {
  deleteContract(input: $input) {
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
