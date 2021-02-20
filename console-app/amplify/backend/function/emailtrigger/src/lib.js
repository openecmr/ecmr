
function getContacts(image) {
    return [...new Set([
        image.shipperContactId,
        image.carrierContactId,
        image.pickupContactId,
        image.deliveryContactId,
        image.driverDriverId,
        image.creatorCompanyId,
        image.trailerVehicleId,
        image.truckVehicleId
    ].filter(Boolean))];
}

async function deleteSearchRecords(dynamodb, deleteImage, searchTable) {
    const deleteContacts = getContacts(deleteImage);
    const deleteDate = deleteImage.updatedAt || deleteImage.createdAt
    const deleteRequest = deleteContacts.map(c => ({
        DeleteRequest: {
            Key: {
                'ownerContactId': {S: deleteImage.owner + '#CONTACT#' + c},
                'typeDateContractId': {S: 'ANY#' + deleteDate + '#' + deleteImage.id}
            }
        }
    }));
    const deleteParam = {
        RequestItems: {
            [searchTable]: deleteRequest
        }
    };
    const deleteResult = await dynamodb.batchWriteItem(deleteParam).promise()

    console.info("deleteResult: ", deleteResult);
    if (deleteResult.UnprocessedItems[searchTable]) {
        console.error("there are unprocessed items");
    }
}


async function addSearchRecords(dynamodb, contract, table) {
    const date = contract.updatedAt || contract.createdAt
    const contacts = getContacts(contract);

    const requests = contacts.map(c => ({
        PutRequest: {
            Item: {
                'ownerContactId': {S: contract.owner + '#CONTACT#' + c},
                'typeDateContractId': {S: 'ANY#' + date + '#' + contract.id},
                'item': {S: contract.id}
            }
        }
    }));

    const param = {
        RequestItems: {
            [table]: requests
        }
    };
    const result = await dynamodb.batchWriteItem(param).promise()
    console.log("result:", result);
}

exports.addSearchRecords = addSearchRecords;
exports.deleteSearchRecords = deleteSearchRecords;