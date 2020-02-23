/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateContract = /* GraphQL */ `
  subscription OnCreateContract($owner: String!) {
    onCreateContract(owner: $owner) {
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
      trailerVehicleId
      truckVehicleId
    }
  }
`;
export const onUpdateContract = /* GraphQL */ `
  subscription OnUpdateContract($owner: String!, $carrierUsername: String!) {
    onUpdateContract(owner: $owner, carrierUsername: $carrierUsername) {
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
      trailerVehicleId
      truckVehicleId
    }
  }
`;
export const onDeleteContract = /* GraphQL */ `
  subscription OnDeleteContract($owner: String!) {
    onDeleteContract(owner: $owner) {
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
      trailerVehicleId
      truckVehicleId
    }
  }
`;
export const onCreateVehicle = /* GraphQL */ `
  subscription OnCreateVehicle($owner: String!) {
    onCreateVehicle(owner: $owner) {
      id
      owner
      companyId
      type
      licensePlateNumber
      description
    }
  }
`;
export const onUpdateVehicle = /* GraphQL */ `
  subscription OnUpdateVehicle($owner: String!) {
    onUpdateVehicle(owner: $owner) {
      id
      owner
      companyId
      type
      licensePlateNumber
      description
    }
  }
`;
export const onDeleteVehicle = /* GraphQL */ `
  subscription OnDeleteVehicle($owner: String!) {
    onDeleteVehicle(owner: $owner) {
      id
      owner
      companyId
      type
      licensePlateNumber
      description
    }
  }
`;
export const onCreateContact = /* GraphQL */ `
  subscription OnCreateContact($owner: String!) {
    onCreateContact(owner: $owner) {
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
export const onUpdateContact = /* GraphQL */ `
  subscription OnUpdateContact($owner: String!) {
    onUpdateContact(owner: $owner) {
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
export const onDeleteContact = /* GraphQL */ `
  subscription OnDeleteContact($owner: String!) {
    onDeleteContact(owner: $owner) {
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
export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany($owner: String!) {
    onCreateCompany(owner: $owner) {
      id
      owner
      name
    }
  }
`;
export const onUpdateCompany = /* GraphQL */ `
  subscription OnUpdateCompany($owner: String!) {
    onUpdateCompany(owner: $owner) {
      id
      owner
      name
    }
  }
`;
export const onDeleteCompany = /* GraphQL */ `
  subscription OnDeleteCompany($owner: String!) {
    onDeleteCompany(owner: $owner) {
      id
      owner
      name
    }
  }
`;
export const onCreateDriver = /* GraphQL */ `
  subscription OnCreateDriver($owner: String!) {
    onCreateDriver(owner: $owner) {
      id
      owner
      name
      carrier
      associationSecret
    }
  }
`;
export const onDeleteDriver = /* GraphQL */ `
  subscription OnDeleteDriver($owner: String!) {
    onDeleteDriver(owner: $owner) {
      id
      owner
      name
      carrier
      associationSecret
    }
  }
`;
export const onUpdateDriver = /* GraphQL */ `
  subscription OnUpdateDriver($owner: String!) {
    onUpdateDriver(owner: $owner) {
      id
      owner
      name
      carrier
      associationSecret
    }
  }
`;
