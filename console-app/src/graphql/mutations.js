/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const activate = `mutation Activate($activationCode: String) {
  activate(activationCode: $activationCode)
}
`;
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
      phone
      email
    }
    carrier {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    delivery {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    arrivalDate
    arrivalTime {
      start
      end
    }
    deliveryDate
    deliveryTime {
      start
      end
    }
    pickup {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    loads {
      category
      quantity
      volume
      loadMeters
      netWeight
      description
      hazardousGoodsItems {
        hazardLabel
      }
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
        signatoryName
        signatoryEmail
      }
      driverObservation
      signatoryObservation
    }
    shipperContactId
    carrierContactId
    pickupContactId
    deliveryContactId
    driverDriverId
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
      phone
      email
    }
    carrier {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    delivery {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    arrivalDate
    arrivalTime {
      start
      end
    }
    deliveryDate
    deliveryTime {
      start
      end
    }
    pickup {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    loads {
      category
      quantity
      volume
      loadMeters
      netWeight
      description
      hazardousGoodsItems {
        hazardLabel
      }
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
        signatoryName
        signatoryEmail
      }
      driverObservation
      signatoryObservation
    }
    shipperContactId
    carrierContactId
    pickupContactId
    deliveryContactId
    driverDriverId
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
      phone
      email
    }
    carrier {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    delivery {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    arrivalDate
    arrivalTime {
      start
      end
    }
    deliveryDate
    deliveryTime {
      start
      end
    }
    pickup {
      name
      postalCode
      address
      city
      country
      phone
      email
    }
    loads {
      category
      quantity
      volume
      loadMeters
      netWeight
      description
      hazardousGoodsItems {
        hazardLabel
      }
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
        signatoryName
        signatoryEmail
      }
      driverObservation
      signatoryObservation
    }
    shipperContactId
    carrierContactId
    pickupContactId
    deliveryContactId
    driverDriverId
  }
}
`;
export const createContact = `mutation CreateContact($input: CreateContactInput!) {
  createContact(input: $input) {
    id
    owner
    name
    postalCode
    address
    city
    country
    phone
    email
  }
}
`;
export const updateContact = `mutation UpdateContact($input: UpdateContactInput!) {
  updateContact(input: $input) {
    id
    owner
    name
    postalCode
    address
    city
    country
    phone
    email
  }
}
`;
export const deleteContact = `mutation DeleteContact($input: DeleteContactInput!) {
  deleteContact(input: $input) {
    id
    owner
    name
    postalCode
    address
    city
    country
    phone
    email
  }
}
`;
export const createCompany = `mutation CreateCompany($input: CreateCompanyInput!) {
  createCompany(input: $input) {
    id
    owner
    name
  }
}
`;
export const updateCompany = `mutation UpdateCompany($input: UpdateCompanyInput!) {
  updateCompany(input: $input) {
    id
    owner
    name
  }
}
`;
export const deleteCompany = `mutation DeleteCompany($input: DeleteCompanyInput!) {
  deleteCompany(input: $input) {
    id
    owner
    name
  }
}
`;
export const createDriver = `mutation CreateDriver($input: CreateDriverInput!) {
  createDriver(input: $input) {
    id
    owner
    name
    carrier
    associationSecret
  }
}
`;
export const deleteDriver = `mutation DeleteDriver($input: DeleteDriverInput!) {
  deleteDriver(input: $input) {
    id
    owner
    name
    carrier
    associationSecret
  }
}
`;
export const updateDriver = `mutation UpdateDriver($input: UpdateDriverInput!) {
  updateDriver(input: $input) {
    id
    owner
    name
    carrier
    associationSecret
  }
}
`;
