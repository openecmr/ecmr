// tslint:disable
// this is an auto generated file. This will be overwritten

export const createContract = `mutation CreateContract($input: CreateContractInput!) {
  createContract(input: $input) {
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
export const updateContract = `mutation UpdateContract($input: UpdateContractInput!) {
  updateContract(input: $input) {
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
export const deleteContract = `mutation DeleteContract($input: DeleteContractInput!) {
  deleteContract(input: $input) {
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
