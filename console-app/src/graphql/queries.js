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
      createdAt
      updatedAt
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
        createdAt
        updatedAt
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
      contactPersons {
        items {
          id
          owner
          contactId
          name
          email
          phone
          address {
            id
            owner
            name
            postalCode
            address
            city
            country
            phone
            email
            contactPersons {
              nextToken
            }
            createdAt
            updatedAt
          }
          addedByDriverDriverId
          createdAt
          updatedAt
          addedByDriver {
            id
            owner
            name
            carrier
            associationSecret
            createdAt
            updatedAt
          }
        }
        nextToken
      }
      createdAt
      updatedAt
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
        contactPersons {
          items {
            id
            owner
            contactId
            name
            email
            phone
            address {
              id
              owner
              name
              postalCode
              address
              city
              country
              phone
              email
              createdAt
              updatedAt
            }
            addedByDriverDriverId
            createdAt
            updatedAt
            addedByDriver {
              id
              owner
              name
              carrier
              associationSecret
              createdAt
              updatedAt
            }
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getContactPerson = /* GraphQL */ `
  query GetContactPerson($id: ID!) {
    getContactPerson(id: $id) {
      id
      owner
      contactId
      name
      email
      phone
      address {
        id
        owner
        name
        postalCode
        address
        city
        country
        phone
        email
        contactPersons {
          items {
            id
            owner
            contactId
            name
            email
            phone
            address {
              id
              owner
              name
              postalCode
              address
              city
              country
              phone
              email
              createdAt
              updatedAt
            }
            addedByDriverDriverId
            createdAt
            updatedAt
            addedByDriver {
              id
              owner
              name
              carrier
              associationSecret
              createdAt
              updatedAt
            }
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      addedByDriverDriverId
      createdAt
      updatedAt
      addedByDriver {
        id
        owner
        name
        carrier
        associationSecret
        createdAt
        updatedAt
      }
    }
  }
`;
export const listContactPersons = /* GraphQL */ `
  query ListContactPersons(
    $filter: ModelContactPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContactPersons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        contactId
        name
        email
        phone
        address {
          id
          owner
          name
          postalCode
          address
          city
          country
          phone
          email
          contactPersons {
            items {
              id
              owner
              contactId
              name
              email
              phone
              addedByDriverDriverId
              createdAt
              updatedAt
            }
            nextToken
          }
          createdAt
          updatedAt
        }
        addedByDriverDriverId
        createdAt
        updatedAt
        addedByDriver {
          id
          owner
          name
          carrier
          associationSecret
          createdAt
          updatedAt
        }
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
      allowedSendingEmail
      createdAt
      updatedAt
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
        allowedSendingEmail
        createdAt
        updatedAt
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
        createdAt
        updatedAt
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
        contactPersons {
          items {
            id
            owner
            contactId
            name
            email
            phone
            address {
              id
              owner
              name
              postalCode
              address
              city
              country
              phone
              email
              createdAt
              updatedAt
            }
            addedByDriverDriverId
            createdAt
            updatedAt
            addedByDriver {
              id
              owner
              name
              carrier
              associationSecret
              createdAt
              updatedAt
            }
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const contactPersonByContact = /* GraphQL */ `
  query ContactPersonByContact(
    $contactId: ID
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContactPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contactPersonByContact(
      contactId: $contactId
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        contactId
        name
        email
        phone
        address {
          id
          owner
          name
          postalCode
          address
          city
          country
          phone
          email
          contactPersons {
            items {
              id
              owner
              contactId
              name
              email
              phone
              addedByDriverDriverId
              createdAt
              updatedAt
            }
            nextToken
          }
          createdAt
          updatedAt
        }
        addedByDriverDriverId
        createdAt
        updatedAt
        addedByDriver {
          id
          owner
          name
          carrier
          associationSecret
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const contactPersonByOwner = /* GraphQL */ `
  query ContactPersonByOwner(
    $owner: String
    $contactIdName: ModelContactPersonByOwnerContactNameCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContactPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contactPersonByOwner(
      owner: $owner
      contactIdName: $contactIdName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        contactId
        name
        email
        phone
        address {
          id
          owner
          name
          postalCode
          address
          city
          country
          phone
          email
          contactPersons {
            items {
              id
              owner
              contactId
              name
              email
              phone
              addedByDriverDriverId
              createdAt
              updatedAt
            }
            nextToken
          }
          createdAt
          updatedAt
        }
        addedByDriverDriverId
        createdAt
        updatedAt
        addedByDriver {
          id
          owner
          name
          carrier
          associationSecret
          createdAt
          updatedAt
        }
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
        allowedSendingEmail
        createdAt
        updatedAt
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
        sendCopy
        assignedDriver {
          name
          username
        }
        photos {
          bucket
          region
          key
        }
        attachments {
          location {
            bucket
            region
            key
          }
          size
          filename
          mimeType
          extension
        }
        deletesAttachments
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
          sendCopy
          assignedDriver {
            name
            username
          }
          photos {
            bucket
            region
            key
          }
          attachments {
            location {
              bucket
              region
              key
            }
            size
            filename
            mimeType
            extension
          }
          deletesAttachments
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
          sendCopy
          assignedDriver {
            name
            username
          }
          photos {
            bucket
            region
            key
          }
          attachments {
            location {
              bucket
              region
              key
            }
            size
            filename
            mimeType
            extension
          }
          deletesAttachments
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
          sendCopy
          assignedDriver {
            name
            username
          }
          photos {
            bucket
            region
            key
          }
          attachments {
            location {
              bucket
              region
              key
            }
            size
            filename
            mimeType
            extension
          }
          deletesAttachments
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
export const contractsByOwnerUpdatedAt = /* GraphQL */ `
  query ContractsByOwnerUpdatedAt(
    $owner: String
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractsByOwnerUpdatedAt(
      owner: $owner
      updatedAt: $updatedAt
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
          sendCopy
          assignedDriver {
            name
            username
          }
          photos {
            bucket
            region
            key
          }
          attachments {
            location {
              bucket
              region
              key
            }
            size
            filename
            mimeType
            extension
          }
          deletesAttachments
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
export const contractsByCarrierUpdatedAt = /* GraphQL */ `
  query ContractsByCarrierUpdatedAt(
    $carrierUsername: String
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractsByCarrierUpdatedAt(
      carrierUsername: $carrierUsername
      updatedAt: $updatedAt
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
          sendCopy
          assignedDriver {
            name
            username
          }
          photos {
            bucket
            region
            key
          }
          attachments {
            location {
              bucket
              region
              key
            }
            size
            filename
            mimeType
            extension
          }
          deletesAttachments
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
        createdAt
        updatedAt
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
      createdAt
      updatedAt
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
        createdAt
        updatedAt
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const driverByCarrier = /* GraphQL */ `
  query DriverByCarrier(
    $carrier: String
    $sortDirection: ModelSortDirection
    $filter: ModelDriverFilterInput
    $limit: Int
    $nextToken: String
  ) {
    driverByCarrier(
      carrier: $carrier
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
