import {API, graphqlOperation, Hub} from "aws-amplify";
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
    const contract = result.data.updateContract;
    Hub.dispatch(
        'Contracts',
        {
            event: 'update',
            data: {
                contract
            }
        });
    return contract;
}

export {
    createUpdateContractInput,
    updateContract
}