/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const pdfexport = `query Pdfexport($id: String) {
  pdfexport(id: $id)
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
    phone
    email
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
      phone
      email
    }
    nextToken
  }
}
`;
export const getCompany = `query GetCompany($id: ID!) {
  getCompany(id: $id) {
    id
    owner
    name
  }
}
`;
export const listCompanys = `query ListCompanys(
  $filter: ModelCompanyFilterInput
  $limit: Int
  $nextToken: String
) {
  listCompanys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      owner
      name
    }
    nextToken
  }
}
`;
export const getContract = `query GetContract($id: ID!) {
  getContract(id: $id) {
    id
    owner
    carrierUsername
    status
    creator {
      name
    }
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
      username
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
      assignedDriver {
        name
        username
      }
    }
    shipperContactId
    carrierContactId
    pickupContactId
    deliveryContactId
    driverDriverId
    creatorCompanyId
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
      creator {
        name
      }
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
        username
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
        assignedDriver {
          name
          username
        }
      }
      shipperContactId
      carrierContactId
      pickupContactId
      deliveryContactId
      driverDriverId
      creatorCompanyId
    }
    nextToken
  }
}
`;
export const getDriver = `query GetDriver($id: ID!) {
  getDriver(id: $id) {
    id
    owner
    name
    carrier
    associationSecret
  }
}
`;
export const listDrivers = `query ListDrivers(
  $filter: ModelDriverFilterInput
  $limit: Int
  $nextToken: String
) {
  listDrivers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      owner
      name
      carrier
      associationSecret
    }
    nextToken
  }
}
`;
