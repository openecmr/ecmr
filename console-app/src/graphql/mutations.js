/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const activate = /* GraphQL */ `
  mutation Activate($activationCode: String) {
    activate(activationCode: $activationCode)
  }
`;
export const createContractCustom = /* GraphQL */ `
  mutation CreateContractCustom($input: CreateContractCustomInput!) {
    createContractCustom(input: $input) {
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
export const createContract = /* GraphQL */ `
  mutation CreateContract($input: CreateContractInput!) {
    createContract(input: $input) {
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
export const updateContract = /* GraphQL */ `
  mutation UpdateContract($input: UpdateContractInput!) {
    updateContract(input: $input) {
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
export const deleteContract = /* GraphQL */ `
  mutation DeleteContract($input: DeleteContractInput!) {
    deleteContract(input: $input) {
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
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile($input: CreateUserProfileInput!) {
    createUserProfile(input: $input) {
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
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
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
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile($input: DeleteUserProfileInput!) {
    deleteUserProfile(input: $input) {
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
export const createVehicle = /* GraphQL */ `
  mutation CreateVehicle($input: CreateVehicleInput!) {
    createVehicle(input: $input) {
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
export const updateVehicle = /* GraphQL */ `
  mutation UpdateVehicle($input: UpdateVehicleInput!) {
    updateVehicle(input: $input) {
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
export const deleteVehicle = /* GraphQL */ `
  mutation DeleteVehicle($input: DeleteVehicleInput!) {
    deleteVehicle(input: $input) {
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
export const createContact = /* GraphQL */ `
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
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
export const updateContact = /* GraphQL */ `
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
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
export const deleteContact = /* GraphQL */ `
  mutation DeleteContact($input: DeleteContactInput!) {
    deleteContact(input: $input) {
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
export const createContactPerson = /* GraphQL */ `
  mutation CreateContactPerson($input: CreateContactPersonInput!) {
    createContactPerson(input: $input) {
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
export const updateContactPerson = /* GraphQL */ `
  mutation UpdateContactPerson($input: UpdateContactPersonInput!) {
    updateContactPerson(input: $input) {
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
export const deleteContactPerson = /* GraphQL */ `
  mutation DeleteContactPerson($input: DeleteContactPersonInput!) {
    deleteContactPerson(input: $input) {
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
export const createCompany = /* GraphQL */ `
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
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
export const updateCompany = /* GraphQL */ `
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
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
export const deleteCompany = /* GraphQL */ `
  mutation DeleteCompany($input: DeleteCompanyInput!) {
    deleteCompany(input: $input) {
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
export const createDriver = /* GraphQL */ `
  mutation CreateDriver($input: CreateDriverInput!) {
    createDriver(input: $input) {
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
export const deleteDriver = /* GraphQL */ `
  mutation DeleteDriver($input: DeleteDriverInput!) {
    deleteDriver(input: $input) {
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
export const updateDriver = /* GraphQL */ `
  mutation UpdateDriver($input: UpdateDriverInput!) {
    updateDriver(input: $input) {
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
