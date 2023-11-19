/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile($owner: String!) {
    onCreateUserProfile(owner: $owner) {
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
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile($owner: String!) {
    onUpdateUserProfile(owner: $owner) {
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
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile($owner: String!) {
    onDeleteUserProfile(owner: $owner) {
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
export const onCreateVehicle = /* GraphQL */ `
  subscription OnCreateVehicle($owner: String, $createdBy: String) {
    onCreateVehicle(owner: $owner, createdBy: $createdBy) {
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
export const onUpdateVehicle = /* GraphQL */ `
  subscription OnUpdateVehicle($owner: String, $createdBy: String) {
    onUpdateVehicle(owner: $owner, createdBy: $createdBy) {
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
export const onDeleteVehicle = /* GraphQL */ `
  subscription OnDeleteVehicle($owner: String, $createdBy: String) {
    onDeleteVehicle(owner: $owner, createdBy: $createdBy) {
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
export const onCreateContact = /* GraphQL */ `
  subscription OnCreateContact($owner: String, $createdBy: String) {
    onCreateContact(owner: $owner, createdBy: $createdBy) {
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
export const onUpdateContact = /* GraphQL */ `
  subscription OnUpdateContact($owner: String, $createdBy: String) {
    onUpdateContact(owner: $owner, createdBy: $createdBy) {
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
export const onDeleteContact = /* GraphQL */ `
  subscription OnDeleteContact($owner: String, $createdBy: String) {
    onDeleteContact(owner: $owner, createdBy: $createdBy) {
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
export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany($owner: String!) {
    onCreateCompany(owner: $owner) {
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
export const onUpdateCompany = /* GraphQL */ `
  subscription OnUpdateCompany($owner: String!) {
    onUpdateCompany(owner: $owner) {
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
export const onDeleteCompany = /* GraphQL */ `
  subscription OnDeleteCompany($owner: String!) {
    onDeleteCompany(owner: $owner) {
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
export const onCreateContract = /* GraphQL */ `
  subscription OnCreateContract(
    $owner: String
    $carrierUsername: String
    $orderOwner: String
    $orderCarrier: String
  ) {
    onCreateContract(
      owner: $owner
      carrierUsername: $carrierUsername
      orderOwner: $orderOwner
      orderCarrier: $orderCarrier
    ) {
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
export const onUpdateContract = /* GraphQL */ `
  subscription OnUpdateContract(
    $owner: String
    $carrierUsername: String
    $orderOwner: String
    $orderCarrier: String
  ) {
    onUpdateContract(
      owner: $owner
      carrierUsername: $carrierUsername
      orderOwner: $orderOwner
      orderCarrier: $orderCarrier
    ) {
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
export const onDeleteContract = /* GraphQL */ `
  subscription OnDeleteContract(
    $owner: String
    $carrierUsername: String
    $orderOwner: String
    $orderCarrier: String
  ) {
    onDeleteContract(
      owner: $owner
      carrierUsername: $carrierUsername
      orderOwner: $orderOwner
      orderCarrier: $orderCarrier
    ) {
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
export const onCreateDriver = /* GraphQL */ `
  subscription OnCreateDriver($owner: String) {
    onCreateDriver(owner: $owner) {
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
export const onUpdateDriver = /* GraphQL */ `
  subscription OnUpdateDriver($owner: String) {
    onUpdateDriver(owner: $owner) {
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
export const onDeleteDriver = /* GraphQL */ `
  subscription OnDeleteDriver($owner: String) {
    onDeleteDriver(owner: $owner) {
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
