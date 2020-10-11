import {API, graphqlOperation} from "aws-amplify";
import * as mutations from "./graphql/mutations";
import moment from "moment";

function createUpdateContractInput(contract) {
    return {
        id: contract.id,
        updatedAt: moment().toISOString(),
        events: contract.events
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