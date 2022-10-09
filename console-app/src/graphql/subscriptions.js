/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany($owner: String!) {
    onCreateCompany(owner: $owner) {
      id
      owner
      name
      allowedSendingEmail
      createdAt
      updatedAt
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
    }
  }
`;
