/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const pdfexport = /* GraphQL */ `
  query Pdfexport($id: String) {
    pdfexport(id: $id)
  }
`;
export const getVehicle = /* GraphQL */ `
  query GetVehicle($id: ID!) {
    getVehicle(id: $id) {
      id
      owner
      companyId
      type
      licensePlateNumber
      description
    }
  }
`;
export const listVehicles = /* GraphQL */ `
  query ListVehicles(
    $filter: ModelVehicleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVehicles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        companyId
        type
        licensePlateNumber
        description
      }
      nextToken
    }
  }
`;
export const getContact = /* GraphQL */ `
  query GetContact($id: ID!) {
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
export const listContacts = /* GraphQL */ `
  query ListContacts(
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
export const getCompany = /* GraphQL */ `
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
      id
      owner
      name
    }
  }
`;
export const listCompanys = /* GraphQL */ `
  query ListCompanys(
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
export const vehicleByOwner = /* GraphQL */ `
  query VehicleByOwner(
    $owner: String
    $licensePlateNumber: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVehicleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    vehicleByOwner(
      owner: $owner
      licensePlateNumber: $licensePlateNumber
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        companyId
        type
        licensePlateNumber
        description
      }
      nextToken
    }
  }
`;
export const contactByOwner = /* GraphQL */ `
  query ContactByOwner(
    $owner: String
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contactByOwner(
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
      }
      nextToken
    }
  }
`;
export const getContract = /* GraphQL */ `
  query GetContract($id: ID!) {
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
        photos {
          bucket
          region
          key
        }
      }
      needAcknowledge
      shipperContactId
      carrierContactId
      pickupContactId
      deliveryContactId
      driverDriverId
      creatorCompanyId
      trailerVehicleId
      truckVehicleId
    }
  }
`;
export const listContracts = /* GraphQL */ `
  query ListContracts(
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
          photos {
            bucket
            region
            key
          }
        }
        needAcknowledge
        shipperContactId
        carrierContactId
        pickupContactId
        deliveryContactId
        driverDriverId
        creatorCompanyId
        trailerVehicleId
        truckVehicleId
      }
      nextToken
    }
  }
`;
export const contractsByOwnerArrivalDate = /* GraphQL */ `
  query ContractsByOwnerArrivalDate(
    $owner: String
    $arrivalDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractsByOwnerArrivalDate(
      owner: $owner
      arrivalDate: $arrivalDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
          photos {
            bucket
            region
            key
          }
        }
        needAcknowledge
        shipperContactId
        carrierContactId
        pickupContactId
        deliveryContactId
        driverDriverId
        creatorCompanyId
        trailerVehicleId
        truckVehicleId
      }
      nextToken
    }
  }
`;
export const contractsByCarrierArrivalDate = /* GraphQL */ `
  query ContractsByCarrierArrivalDate(
    $carrierUsername: String
    $arrivalDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractsByCarrierArrivalDate(
      carrierUsername: $carrierUsername
      arrivalDate: $arrivalDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
          photos {
            bucket
            region
            key
          }
        }
        needAcknowledge
        shipperContactId
        carrierContactId
        pickupContactId
        deliveryContactId
        driverDriverId
        creatorCompanyId
        trailerVehicleId
        truckVehicleId
      }
      nextToken
    }
  }
`;
export const getDriver = /* GraphQL */ `
  query GetDriver($id: ID!) {
    getDriver(id: $id) {
      id
      owner
      name
      carrier
      associationSecret
    }
  }
`;
export const listDrivers = /* GraphQL */ `
  query ListDrivers(
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
export const driverByAssociationSecret = /* GraphQL */ `
  query DriverByAssociationSecret(
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
  }
`;
export const driverByOwner = /* GraphQL */ `
  query DriverByOwner(
    $owner: String
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDriverFilterInput
    $limit: Int
    $nextToken: String
  ) {
    driverByOwner(
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
        carrier
        associationSecret
      }
      nextToken
    }
  }
`;
