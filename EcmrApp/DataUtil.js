import {API, graphqlOperation} from "aws-amplify";
import * as mutations from "./graphql/mutations";

function createUpdateContractInput(contract) {
    return {
        id: contract.id,
        owner: contract.owner,
        carrierUsername: contract.username,
        status: contract.status,
        arrivalDate: contract.arrivalDate,
        deliveryDate: contract.deliveryDate,
        loads: contract.loads,
        driver: contract.driver,
        trailer: contract.trailer,
        truck: contract.truck,
        references: contract.references,
        updatedAt: contract.updatedAt,
        createdAt: contract.createdAt,
        events: contract.events,
        contractShipperId: contract.shipper.id,
        contractCarrierId: contract.carrier.id,
        contractDeliveryId: contract.delivery.id,
        contractPickupId: contract.pickup.id
    };
}

async function updateContract(item) {
    const result = await API.graphql(graphqlOperation(mutations.updateContract, {input: item}));
    return result.data.updateContract;
}

export {
    createUpdateContractInput,
    updateContract
}