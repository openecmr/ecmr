import gql from 'graphql-tag';

export default gql(`query ListContracts(
    $filter: ModelContractFilterInput
$limit: Int
$nextToken: String
) {
    listContracts(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
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
        nextToken
    }
}`);
