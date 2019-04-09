// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateContract = `subscription OnCreateContract {
  onCreateContract {
    id
    sequentialId
    status
    shipper {
      name
      postalCode
      address
      city
      country
    }
    carrier {
      name
      postalCode
      address
      city
      country
    }
    delivery {
      name
      postalCode
      address
      city
      country
    }
    arrivalDate
    deliveryDate
    pickup {
      name
      postalCode
      address
      city
      country
    }
    loads {
      category
      quantity
      description
    }
    driver {
      name
    }
    trailer
    truck
    references {
      carrier
    }
  }
}
`;
export const onUpdateContract = `subscription OnUpdateContract {
  onUpdateContract {
    id
    sequentialId
    status
    shipper {
      name
      postalCode
      address
      city
      country
    }
    carrier {
      name
      postalCode
      address
      city
      country
    }
    delivery {
      name
      postalCode
      address
      city
      country
    }
    arrivalDate
    deliveryDate
    pickup {
      name
      postalCode
      address
      city
      country
    }
    loads {
      category
      quantity
      description
    }
    driver {
      name
    }
    trailer
    truck
    references {
      carrier
    }
  }
}
`;
export const onDeleteContract = `subscription OnDeleteContract {
  onDeleteContract {
    id
    sequentialId
    status
    shipper {
      name
      postalCode
      address
      city
      country
    }
    carrier {
      name
      postalCode
      address
      city
      country
    }
    delivery {
      name
      postalCode
      address
      city
      country
    }
    arrivalDate
    deliveryDate
    pickup {
      name
      postalCode
      address
      city
      country
    }
    loads {
      category
      quantity
      description
    }
    driver {
      name
    }
    trailer
    truck
    references {
      carrier
    }
  }
}
`;
