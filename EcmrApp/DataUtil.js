import {API, graphqlOperation, Hub, Storage} from "aws-amplify";
import * as mutations from "./graphql/mutations";
import moment from "moment";
import UUIDGenerator from "react-native-uuid-generator";
import * as queries from "./graphql/queries";

function createUpdateContractInput(contract) {
    return {
        id: contract.id,
        updatedAt: moment().toISOString(),
        events: contract.events
    };
}

async function updateContract(contract) {
    if (contract.events) {
        const response = await API.graphql(graphqlOperation(queries.getContract, {
            "id": contract.id
        }));
        const currentContract = response.data.getContract;
        const currentEvents = currentContract.events || [];
        contract.events = [
            ...currentEvents,
            ...contract.events.filter(e => currentEvents.findIndex(ce => e.createdAt === ce.createdAt) === -1)
        ];
    }

    const result = await API.graphql(graphqlOperation(mutations.updateContract, {input: contract}));
    const updatedContract = result.data.updateContract;
    Hub.dispatch(
        'Contracts',
        {
            event: 'update',
            data: {
                contract: updatedContract
            }
        });
    return updatedContract;
}

async function uploadPhotos(photos) {
    return await Promise.all(photos.map(async (photo) => {
        const fetchResponse = await fetch(photo.uri);
        const photoBuffer = await fetchResponse.blob();
        const key = 'photo-' + (await UUIDGenerator.getRandomUUID()) + ".jpg";
        return {
            bucket: 'bucket',
            region: 'eu-central-1',
            key: (await Storage.put(key, photoBuffer)).key
        }
    }));
}

export {
    createUpdateContractInput,
    updateContract,
    uploadPhotos
}