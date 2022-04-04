import {API, graphqlOperation, Hub, Storage} from "aws-amplify";
import * as mutations from "./graphql/mutations";
import moment from "moment";
import UUIDGenerator from "react-native-uuid-generator";

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