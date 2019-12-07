/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateContact = `subscription OnCreateContact($owner: String!) {
  onCreateContact(owner: $owner) {
    id
    owner
    name
    postalCode
    address
    city
    country
  }
}
`;
export const onUpdateContact = `subscription OnUpdateContact($owner: String!) {
  onUpdateContact(owner: $owner) {
    id
    owner
    name
    postalCode
    address
    city
    country
  }
}
`;
export const onDeleteContact = `subscription OnDeleteContact($owner: String!) {
  onDeleteContact(owner: $owner) {
    id
    owner
    name
    postalCode
    address
    city
    country
  }
}
`;
export const onCreateDriver = `subscription OnCreateDriver($owner: String!) {
  onCreateDriver(owner: $owner) {
    id
    owner
    name
    carrier
    associationSecret
  }
}
`;
export const onDeleteDriver = `subscription OnDeleteDriver($owner: String!) {
  onDeleteDriver(owner: $owner) {
    id
    owner
    name
    carrier
    associationSecret
  }
}
`;
export const onUpdateDriver = `subscription OnUpdateDriver($owner: String!) {
  onUpdateDriver(owner: $owner) {
    id
    owner
    name
    carrier
    associationSecret
  }
}
`;
