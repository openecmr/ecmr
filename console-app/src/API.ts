/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateContractInput = {
  id?: string | null,
  sequentialId?: string | null,
  status?: ContractStatus | null,
  shipper?: AddressInput | null,
  carrier?: AddressInput | null,
  delivery?: AddressInput | null,
  arrivalDate?: string | null,
  deliveryDate?: string | null,
  pickup?: AddressInput | null,
  loads: Array< LoadInput | null >,
  driver?: DriverInput | null,
  trailer?: string | null,
  truck?: string | null,
  references?: ReferenceInput | null,
};

export enum ContractStatus {
  DRAFT = "DRAFT",
  PICKUP = "PICKUP",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}


export type AddressInput = {
  name?: string | null,
  postalCode?: string | null,
  address?: string | null,
  city?: string | null,
  country?: string | null,
};

export type LoadInput = {
  category?: string | null,
  quantity?: string | null,
  description?: string | null,
};

export type DriverInput = {
  name: string,
};

export type ReferenceInput = {
  carrier?: string | null,
};

export type UpdateContractInput = {
  id: string,
  sequentialId?: string | null,
  status?: ContractStatus | null,
  shipper?: AddressInput | null,
  carrier?: AddressInput | null,
  delivery?: AddressInput | null,
  arrivalDate?: string | null,
  deliveryDate?: string | null,
  pickup?: AddressInput | null,
  loads?: Array< LoadInput | null > | null,
  driver?: DriverInput | null,
  trailer?: string | null,
  truck?: string | null,
  references?: ReferenceInput | null,
};

export type DeleteContractInput = {
  id?: string | null,
};

export type ModelContractFilterInput = {
  id?: ModelIDFilterInput | null,
  sequentialId?: ModelStringFilterInput | null,
  arrivalDate?: ModelStringFilterInput | null,
  deliveryDate?: ModelStringFilterInput | null,
  trailer?: ModelStringFilterInput | null,
  truck?: ModelStringFilterInput | null,
  and?: Array< ModelContractFilterInput | null > | null,
  or?: Array< ModelContractFilterInput | null > | null,
  not?: ModelContractFilterInput | null,
};

export type ModelIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type CreateContractMutationVariables = {
  input: CreateContractInput,
};

export type CreateContractMutation = {
  createContract:  {
    __typename: "Contract",
    id: string | null,
    sequentialId: string | null,
    status: ContractStatus | null,
    shipper:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    carrier:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    delivery:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    arrivalDate: string | null,
    deliveryDate: string | null,
    pickup:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    loads:  Array< {
      __typename: "Load",
      category: string | null,
      quantity: string | null,
      description: string | null,
    } | null >,
    driver:  {
      __typename: "Driver",
      name: string,
    } | null,
    trailer: string | null,
    truck: string | null,
    references:  {
      __typename: "Reference",
      carrier: string | null,
    } | null,
  } | null,
};

export type UpdateContractMutationVariables = {
  input: UpdateContractInput,
};

export type UpdateContractMutation = {
  updateContract:  {
    __typename: "Contract",
    id: string | null,
    sequentialId: string | null,
    status: ContractStatus | null,
    shipper:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    carrier:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    delivery:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    arrivalDate: string | null,
    deliveryDate: string | null,
    pickup:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    loads:  Array< {
      __typename: "Load",
      category: string | null,
      quantity: string | null,
      description: string | null,
    } | null >,
    driver:  {
      __typename: "Driver",
      name: string,
    } | null,
    trailer: string | null,
    truck: string | null,
    references:  {
      __typename: "Reference",
      carrier: string | null,
    } | null,
  } | null,
};

export type DeleteContractMutationVariables = {
  input: DeleteContractInput,
};

export type DeleteContractMutation = {
  deleteContract:  {
    __typename: "Contract",
    id: string | null,
    sequentialId: string | null,
    status: ContractStatus | null,
    shipper:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    carrier:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    delivery:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    arrivalDate: string | null,
    deliveryDate: string | null,
    pickup:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    loads:  Array< {
      __typename: "Load",
      category: string | null,
      quantity: string | null,
      description: string | null,
    } | null >,
    driver:  {
      __typename: "Driver",
      name: string,
    } | null,
    trailer: string | null,
    truck: string | null,
    references:  {
      __typename: "Reference",
      carrier: string | null,
    } | null,
  } | null,
};

export type GetContractQueryVariables = {
  id: string,
};

export type GetContractQuery = {
  getContract:  {
    __typename: "Contract",
    id: string | null,
    sequentialId: string | null,
    status: ContractStatus | null,
    shipper:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    carrier:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    delivery:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    arrivalDate: string | null,
    deliveryDate: string | null,
    pickup:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    loads:  Array< {
      __typename: "Load",
      category: string | null,
      quantity: string | null,
      description: string | null,
    } | null >,
    driver:  {
      __typename: "Driver",
      name: string,
    } | null,
    trailer: string | null,
    truck: string | null,
    references:  {
      __typename: "Reference",
      carrier: string | null,
    } | null,
  } | null,
};

export type ListContractsQueryVariables = {
  filter?: ModelContractFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContractsQuery = {
  listContracts:  {
    __typename: "ModelContractConnection",
    items:  Array< {
      __typename: "Contract",
      id: string | null,
      sequentialId: string | null,
      status: ContractStatus | null,
      shipper:  {
        __typename: "Address",
        name: string | null,
        postalCode: string | null,
        address: string | null,
        city: string | null,
        country: string | null,
      } | null,
      carrier:  {
        __typename: "Address",
        name: string | null,
        postalCode: string | null,
        address: string | null,
        city: string | null,
        country: string | null,
      } | null,
      delivery:  {
        __typename: "Address",
        name: string | null,
        postalCode: string | null,
        address: string | null,
        city: string | null,
        country: string | null,
      } | null,
      arrivalDate: string | null,
      deliveryDate: string | null,
      pickup:  {
        __typename: "Address",
        name: string | null,
        postalCode: string | null,
        address: string | null,
        city: string | null,
        country: string | null,
      } | null,
      loads:  Array< {
        __typename: "Load",
        category: string | null,
        quantity: string | null,
        description: string | null,
      } | null >,
      driver:  {
        __typename: "Driver",
        name: string,
      } | null,
      trailer: string | null,
      truck: string | null,
      references:  {
        __typename: "Reference",
        carrier: string | null,
      } | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateContractSubscription = {
  onCreateContract:  {
    __typename: "Contract",
    id: string | null,
    sequentialId: string | null,
    status: ContractStatus | null,
    shipper:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    carrier:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    delivery:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    arrivalDate: string | null,
    deliveryDate: string | null,
    pickup:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    loads:  Array< {
      __typename: "Load",
      category: string | null,
      quantity: string | null,
      description: string | null,
    } | null >,
    driver:  {
      __typename: "Driver",
      name: string,
    } | null,
    trailer: string | null,
    truck: string | null,
    references:  {
      __typename: "Reference",
      carrier: string | null,
    } | null,
  } | null,
};

export type OnUpdateContractSubscription = {
  onUpdateContract:  {
    __typename: "Contract",
    id: string | null,
    sequentialId: string | null,
    status: ContractStatus | null,
    shipper:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    carrier:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    delivery:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    arrivalDate: string | null,
    deliveryDate: string | null,
    pickup:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    loads:  Array< {
      __typename: "Load",
      category: string | null,
      quantity: string | null,
      description: string | null,
    } | null >,
    driver:  {
      __typename: "Driver",
      name: string,
    } | null,
    trailer: string | null,
    truck: string | null,
    references:  {
      __typename: "Reference",
      carrier: string | null,
    } | null,
  } | null,
};

export type OnDeleteContractSubscription = {
  onDeleteContract:  {
    __typename: "Contract",
    id: string | null,
    sequentialId: string | null,
    status: ContractStatus | null,
    shipper:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    carrier:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    delivery:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    arrivalDate: string | null,
    deliveryDate: string | null,
    pickup:  {
      __typename: "Address",
      name: string | null,
      postalCode: string | null,
      address: string | null,
      city: string | null,
      country: string | null,
    } | null,
    loads:  Array< {
      __typename: "Load",
      category: string | null,
      quantity: string | null,
      description: string | null,
    } | null >,
    driver:  {
      __typename: "Driver",
      name: string,
    } | null,
    trailer: string | null,
    truck: string | null,
    references:  {
      __typename: "Reference",
      carrier: string | null,
    } | null,
  } | null,
};
