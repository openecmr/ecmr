/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const pdfexport = /* GraphQL */ `
  query Pdfexport($id: String) {
    pdfexport(id: $id)
  }
`;
export const rpdfexport = /* GraphQL */ `
  query Rpdfexport($id: String) {
    rpdfexport(id: $id)
  }
`;
export const contractsByFilterCustom = /* GraphQL */ `
  query ContractsByFilterCustom(
    $owner: String!
    $contactId: ID!
    $updatedAt: CustomModelStringKeyConditionInput
    $sortDirection: CustomModelSortDirection
    $limit: Int
    $nextToken: String
  ) {
    contractsByFilterCustom(
      owner: $owner
      contactId: $contactId
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        carrierUsername
        status
        orderOwner
        orderCarrier
        orderStatus
        orderDate
        creator {
          name
          __typename
        }
        shipper {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        carrier {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        delivery {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        arrivalDate
        arrivalTime {
          start
          end
          __typename
        }
        deliveryDate
        deliveryTime {
          start
          end
          __typename
        }
        pickup {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
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
            __typename
          }
          __typename
        }
        driver {
          name
          username
          __typename
        }
        trailer
        truck
        references {
          carrier
          __typename
        }
        updatedAt
        createdAt
        events {
          author {
            username
            __typename
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
              __typename
            }
            signatureImageSignatory {
              bucket
              region
              key
              __typename
            }
            signatoryName
            signatoryEmail
            __typename
          }
          driverObservation
          signatoryObservation
          sendCopy
          assignedDriver {
            name
            username
            __typename
          }
          photos {
            bucket
            region
            key
            __typename
          }
          attachments {
            location {
              bucket
              region
              key
              __typename
            }
            size
            filename
            mimeType
            extension
            __typename
          }
          attachmentType
          attachmentDescription
          deletesAttachments
          oldLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          oldAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          geoposition {
            latitude
            longitude
            accuracy
            altitude
            heading
            speed
            altitudeAccuracy
            timestamp
            mocked
            provider
            __typename
          }
          __typename
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
        openecmrId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      owner
      updatedAt
      signatureImage {
        bucket
        region
        key
        __typename
      }
      createdAt
      __typename
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        updatedAt
        signatureImage {
          bucket
          region
          key
          __typename
        }
        createdAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVehicle = /* GraphQL */ `
  query GetVehicle($id: ID!) {
    getVehicle(id: $id) {
      id
      owner
      createdBy
      companyId
      type
      licensePlateNumber
      description
      createdAt
      updatedAt
      __typename
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
        createdBy
        companyId
        type
        licensePlateNumber
        description
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getContact = /* GraphQL */ `
  query GetContact($id: ID!) {
    getContact(id: $id) {
      id
      owner
      createdBy
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
            createdBy
            name
            postalCode
            address
            city
            country
            phone
            email
            contactPersons {
              nextToken
              __typename
            }
            createdAt
            updatedAt
            __typename
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
            __typename
          }
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        createdBy
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
              createdBy
              name
              postalCode
              address
              city
              country
              phone
              email
              createdAt
              updatedAt
              __typename
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
              __typename
            }
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
        createdBy
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
              createdBy
              name
              postalCode
              address
              city
              country
              phone
              email
              createdAt
              updatedAt
              __typename
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
              __typename
            }
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
        __typename
      }
      __typename
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
          createdBy
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
              __typename
            }
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
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
          __typename
        }
        __typename
      }
      nextToken
      __typename
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
      __typename
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userProfileByOwner = /* GraphQL */ `
  query UserProfileByOwner(
    $owner: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userProfileByOwner(
      owner: $owner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        updatedAt
        signatureImage {
          bucket
          region
          key
          __typename
        }
        createdAt
        __typename
      }
      nextToken
      __typename
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
        createdBy
        companyId
        type
        licensePlateNumber
        description
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
        createdBy
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
              createdBy
              name
              postalCode
              address
              city
              country
              phone
              email
              createdAt
              updatedAt
              __typename
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
              __typename
            }
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
          createdBy
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
              __typename
            }
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
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
          __typename
        }
        __typename
      }
      nextToken
      __typename
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
          createdBy
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
              __typename
            }
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
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
          __typename
        }
        __typename
      }
      nextToken
      __typename
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
        __typename
      }
      nextToken
      __typename
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
        orderOwner
        orderCarrier
        orderStatus
        orderDate
        creator {
          name
          __typename
        }
        shipper {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        carrier {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        delivery {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        arrivalDate
        arrivalTime {
          start
          end
          __typename
        }
        deliveryDate
        deliveryTime {
          start
          end
          __typename
        }
        pickup {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
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
            __typename
          }
          __typename
        }
        driver {
          name
          username
          __typename
        }
        trailer
        truck
        references {
          carrier
          __typename
        }
        updatedAt
        createdAt
        events {
          author {
            username
            __typename
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
              __typename
            }
            signatureImageSignatory {
              bucket
              region
              key
              __typename
            }
            signatoryName
            signatoryEmail
            __typename
          }
          driverObservation
          signatoryObservation
          sendCopy
          assignedDriver {
            name
            username
            __typename
          }
          photos {
            bucket
            region
            key
            __typename
          }
          attachments {
            location {
              bucket
              region
              key
              __typename
            }
            size
            filename
            mimeType
            extension
            __typename
          }
          attachmentType
          attachmentDescription
          deletesAttachments
          oldLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          oldAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          geoposition {
            latitude
            longitude
            accuracy
            altitude
            heading
            speed
            altitudeAccuracy
            timestamp
            mocked
            provider
            __typename
          }
          __typename
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
        openecmrId
        __typename
      }
      nextToken
      __typename
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
        orderOwner
        orderCarrier
        orderStatus
        orderDate
        creator {
          name
          __typename
        }
        shipper {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        carrier {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        delivery {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        arrivalDate
        arrivalTime {
          start
          end
          __typename
        }
        deliveryDate
        deliveryTime {
          start
          end
          __typename
        }
        pickup {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
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
            __typename
          }
          __typename
        }
        driver {
          name
          username
          __typename
        }
        trailer
        truck
        references {
          carrier
          __typename
        }
        updatedAt
        createdAt
        events {
          author {
            username
            __typename
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
              __typename
            }
            signatureImageSignatory {
              bucket
              region
              key
              __typename
            }
            signatoryName
            signatoryEmail
            __typename
          }
          driverObservation
          signatoryObservation
          sendCopy
          assignedDriver {
            name
            username
            __typename
          }
          photos {
            bucket
            region
            key
            __typename
          }
          attachments {
            location {
              bucket
              region
              key
              __typename
            }
            size
            filename
            mimeType
            extension
            __typename
          }
          attachmentType
          attachmentDescription
          deletesAttachments
          oldLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          oldAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          geoposition {
            latitude
            longitude
            accuracy
            altitude
            heading
            speed
            altitudeAccuracy
            timestamp
            mocked
            provider
            __typename
          }
          __typename
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
        openecmrId
        __typename
      }
      nextToken
      __typename
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
        orderOwner
        orderCarrier
        orderStatus
        orderDate
        creator {
          name
          __typename
        }
        shipper {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        carrier {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        delivery {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        arrivalDate
        arrivalTime {
          start
          end
          __typename
        }
        deliveryDate
        deliveryTime {
          start
          end
          __typename
        }
        pickup {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
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
            __typename
          }
          __typename
        }
        driver {
          name
          username
          __typename
        }
        trailer
        truck
        references {
          carrier
          __typename
        }
        updatedAt
        createdAt
        events {
          author {
            username
            __typename
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
              __typename
            }
            signatureImageSignatory {
              bucket
              region
              key
              __typename
            }
            signatoryName
            signatoryEmail
            __typename
          }
          driverObservation
          signatoryObservation
          sendCopy
          assignedDriver {
            name
            username
            __typename
          }
          photos {
            bucket
            region
            key
            __typename
          }
          attachments {
            location {
              bucket
              region
              key
              __typename
            }
            size
            filename
            mimeType
            extension
            __typename
          }
          attachmentType
          attachmentDescription
          deletesAttachments
          oldLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          oldAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          geoposition {
            latitude
            longitude
            accuracy
            altitude
            heading
            speed
            altitudeAccuracy
            timestamp
            mocked
            provider
            __typename
          }
          __typename
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
        openecmrId
        __typename
      }
      nextToken
      __typename
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
        orderOwner
        orderCarrier
        orderStatus
        orderDate
        creator {
          name
          __typename
        }
        shipper {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        carrier {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        delivery {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        arrivalDate
        arrivalTime {
          start
          end
          __typename
        }
        deliveryDate
        deliveryTime {
          start
          end
          __typename
        }
        pickup {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
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
            __typename
          }
          __typename
        }
        driver {
          name
          username
          __typename
        }
        trailer
        truck
        references {
          carrier
          __typename
        }
        updatedAt
        createdAt
        events {
          author {
            username
            __typename
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
              __typename
            }
            signatureImageSignatory {
              bucket
              region
              key
              __typename
            }
            signatoryName
            signatoryEmail
            __typename
          }
          driverObservation
          signatoryObservation
          sendCopy
          assignedDriver {
            name
            username
            __typename
          }
          photos {
            bucket
            region
            key
            __typename
          }
          attachments {
            location {
              bucket
              region
              key
              __typename
            }
            size
            filename
            mimeType
            extension
            __typename
          }
          attachmentType
          attachmentDescription
          deletesAttachments
          oldLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          oldAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          geoposition {
            latitude
            longitude
            accuracy
            altitude
            heading
            speed
            altitudeAccuracy
            timestamp
            mocked
            provider
            __typename
          }
          __typename
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
        openecmrId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ordersByOwnerCreatedAt = /* GraphQL */ `
  query OrdersByOwnerCreatedAt(
    $orderOwner: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ordersByOwnerCreatedAt(
      orderOwner: $orderOwner
      createdAt: $createdAt
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
        orderOwner
        orderCarrier
        orderStatus
        orderDate
        creator {
          name
          __typename
        }
        shipper {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        carrier {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        delivery {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        arrivalDate
        arrivalTime {
          start
          end
          __typename
        }
        deliveryDate
        deliveryTime {
          start
          end
          __typename
        }
        pickup {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
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
            __typename
          }
          __typename
        }
        driver {
          name
          username
          __typename
        }
        trailer
        truck
        references {
          carrier
          __typename
        }
        updatedAt
        createdAt
        events {
          author {
            username
            __typename
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
              __typename
            }
            signatureImageSignatory {
              bucket
              region
              key
              __typename
            }
            signatoryName
            signatoryEmail
            __typename
          }
          driverObservation
          signatoryObservation
          sendCopy
          assignedDriver {
            name
            username
            __typename
          }
          photos {
            bucket
            region
            key
            __typename
          }
          attachments {
            location {
              bucket
              region
              key
              __typename
            }
            size
            filename
            mimeType
            extension
            __typename
          }
          attachmentType
          attachmentDescription
          deletesAttachments
          oldLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          oldAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          geoposition {
            latitude
            longitude
            accuracy
            altitude
            heading
            speed
            altitudeAccuracy
            timestamp
            mocked
            provider
            __typename
          }
          __typename
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
        openecmrId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ordersByCarrierCreatedAt = /* GraphQL */ `
  query OrdersByCarrierCreatedAt(
    $orderCarrier: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ordersByCarrierCreatedAt(
      orderCarrier: $orderCarrier
      createdAt: $createdAt
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
        orderOwner
        orderCarrier
        orderStatus
        orderDate
        creator {
          name
          __typename
        }
        shipper {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        carrier {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        delivery {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        arrivalDate
        arrivalTime {
          start
          end
          __typename
        }
        deliveryDate
        deliveryTime {
          start
          end
          __typename
        }
        pickup {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
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
            __typename
          }
          __typename
        }
        driver {
          name
          username
          __typename
        }
        trailer
        truck
        references {
          carrier
          __typename
        }
        updatedAt
        createdAt
        events {
          author {
            username
            __typename
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
              __typename
            }
            signatureImageSignatory {
              bucket
              region
              key
              __typename
            }
            signatoryName
            signatoryEmail
            __typename
          }
          driverObservation
          signatoryObservation
          sendCopy
          assignedDriver {
            name
            username
            __typename
          }
          photos {
            bucket
            region
            key
            __typename
          }
          attachments {
            location {
              bucket
              region
              key
              __typename
            }
            size
            filename
            mimeType
            extension
            __typename
          }
          attachmentType
          attachmentDescription
          deletesAttachments
          oldLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          oldAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          geoposition {
            latitude
            longitude
            accuracy
            altitude
            heading
            speed
            altitudeAccuracy
            timestamp
            mocked
            provider
            __typename
          }
          __typename
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
        openecmrId
        __typename
      }
      nextToken
      __typename
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
      orderOwner
      orderCarrier
      orderStatus
      orderDate
      creator {
        name
        __typename
      }
      shipper {
        name
        postalCode
        address
        city
        country
        phone
        email
        __typename
      }
      carrier {
        name
        postalCode
        address
        city
        country
        phone
        email
        __typename
      }
      delivery {
        name
        postalCode
        address
        city
        country
        phone
        email
        __typename
      }
      arrivalDate
      arrivalTime {
        start
        end
        __typename
      }
      deliveryDate
      deliveryTime {
        start
        end
        __typename
      }
      pickup {
        name
        postalCode
        address
        city
        country
        phone
        email
        __typename
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
          __typename
        }
        __typename
      }
      driver {
        name
        username
        __typename
      }
      trailer
      truck
      references {
        carrier
        __typename
      }
      updatedAt
      createdAt
      events {
        author {
          username
          __typename
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
            __typename
          }
          signatureImageSignatory {
            bucket
            region
            key
            __typename
          }
          signatoryName
          signatoryEmail
          __typename
        }
        driverObservation
        signatoryObservation
        sendCopy
        assignedDriver {
          name
          username
          __typename
        }
        photos {
          bucket
          region
          key
          __typename
        }
        attachments {
          location {
            bucket
            region
            key
            __typename
          }
          size
          filename
          mimeType
          extension
          __typename
        }
        attachmentType
        attachmentDescription
        deletesAttachments
        oldLoads {
          category
          quantity
          volume
          loadMeters
          netWeight
          description
          hazardousGoodsItems {
            hazardLabel
            __typename
          }
          __typename
        }
        newLoads {
          category
          quantity
          volume
          loadMeters
          netWeight
          description
          hazardousGoodsItems {
            hazardLabel
            __typename
          }
          __typename
        }
        newAttributes {
          shipper {
            name
            postalCode
            address
            city
            country
            phone
            email
            __typename
          }
          carrier {
            name
            postalCode
            address
            city
            country
            phone
            email
            __typename
          }
          delivery {
            name
            postalCode
            address
            city
            country
            phone
            email
            __typename
          }
          arrivalDate
          arrivalTime {
            start
            end
            __typename
          }
          deliveryDate
          deliveryTime {
            start
            end
            __typename
          }
          pickup {
            name
            postalCode
            address
            city
            country
            phone
            email
            __typename
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
              __typename
            }
            __typename
          }
          trailer
          truck
          references {
            carrier
            __typename
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
          __typename
        }
        oldAttributes {
          shipper {
            name
            postalCode
            address
            city
            country
            phone
            email
            __typename
          }
          carrier {
            name
            postalCode
            address
            city
            country
            phone
            email
            __typename
          }
          delivery {
            name
            postalCode
            address
            city
            country
            phone
            email
            __typename
          }
          arrivalDate
          arrivalTime {
            start
            end
            __typename
          }
          deliveryDate
          deliveryTime {
            start
            end
            __typename
          }
          pickup {
            name
            postalCode
            address
            city
            country
            phone
            email
            __typename
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
              __typename
            }
            __typename
          }
          trailer
          truck
          references {
            carrier
            __typename
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
          __typename
        }
        geoposition {
          latitude
          longitude
          accuracy
          altitude
          heading
          speed
          altitudeAccuracy
          timestamp
          mocked
          provider
          __typename
        }
        __typename
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
      openecmrId
      __typename
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
        orderOwner
        orderCarrier
        orderStatus
        orderDate
        creator {
          name
          __typename
        }
        shipper {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        carrier {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        delivery {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
        }
        arrivalDate
        arrivalTime {
          start
          end
          __typename
        }
        deliveryDate
        deliveryTime {
          start
          end
          __typename
        }
        pickup {
          name
          postalCode
          address
          city
          country
          phone
          email
          __typename
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
            __typename
          }
          __typename
        }
        driver {
          name
          username
          __typename
        }
        trailer
        truck
        references {
          carrier
          __typename
        }
        updatedAt
        createdAt
        events {
          author {
            username
            __typename
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
              __typename
            }
            signatureImageSignatory {
              bucket
              region
              key
              __typename
            }
            signatoryName
            signatoryEmail
            __typename
          }
          driverObservation
          signatoryObservation
          sendCopy
          assignedDriver {
            name
            username
            __typename
          }
          photos {
            bucket
            region
            key
            __typename
          }
          attachments {
            location {
              bucket
              region
              key
              __typename
            }
            size
            filename
            mimeType
            extension
            __typename
          }
          attachmentType
          attachmentDescription
          deletesAttachments
          oldLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newLoads {
            category
            quantity
            volume
            loadMeters
            netWeight
            description
            hazardousGoodsItems {
              hazardLabel
              __typename
            }
            __typename
          }
          newAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          oldAttributes {
            shipper {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            carrier {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            delivery {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            arrivalDate
            arrivalTime {
              start
              end
              __typename
            }
            deliveryDate
            deliveryTime {
              start
              end
              __typename
            }
            pickup {
              name
              postalCode
              address
              city
              country
              phone
              email
              __typename
            }
            loads {
              category
              quantity
              volume
              loadMeters
              netWeight
              description
              __typename
            }
            trailer
            truck
            references {
              carrier
              __typename
            }
            shipperContactId
            carrierContactId
            pickupContactId
            deliveryContactId
            trailerVehicleId
            truckVehicleId
            __typename
          }
          geoposition {
            latitude
            longitude
            accuracy
            altitude
            heading
            speed
            altitudeAccuracy
            timestamp
            mocked
            provider
            __typename
          }
          __typename
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
        openecmrId
        __typename
      }
      nextToken
      __typename
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
      __typename
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
        __typename
      }
      nextToken
      __typename
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
        __typename
      }
      nextToken
      __typename
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
        __typename
      }
      nextToken
      __typename
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
