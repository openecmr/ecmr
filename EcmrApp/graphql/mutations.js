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
          }
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
          }
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
          trailer
          truck
          references {
            carrier
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
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
          trailer
          truck
          references {
            carrier
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
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
      openecmrId
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
          }
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
          }
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
          trailer
          truck
          references {
            carrier
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
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
          trailer
          truck
          references {
            carrier
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
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
      openecmrId
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
          }
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
          }
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
          trailer
          truck
          references {
            carrier
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
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
          trailer
          truck
          references {
            carrier
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
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
      openecmrId
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
          }
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
          }
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
          trailer
          truck
          references {
            carrier
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
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
          trailer
          truck
          references {
            carrier
          }
          shipperContactId
          carrierContactId
          pickupContactId
          deliveryContactId
          trailerVehicleId
          truckVehicleId
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
      openecmrId
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
      }
      createdAt
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
      }
      createdAt
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
      }
      createdAt
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
export const createCompany = /* GraphQL */ `
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      owner
      name
      allowedSendingEmail
      createdAt
      updatedAt
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
    }
  }
`;
