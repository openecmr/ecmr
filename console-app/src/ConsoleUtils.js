import ReactGA from "react-ga";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import { generateClient } from 'aws-amplify/api';

const generateAssociationSecret = () => {
    const random = new Uint8Array(6);
    window.crypto.getRandomValues(random);
    let associationSecret = "";
    for (let i = 0; i < random.length; i++) {
        associationSecret += String.fromCharCode(64 + (random[i] % 26) + 1);
    }
    return associationSecret;
};

const trackEvent = ({category, action, label}) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label
    });
};

const doUpdateContract = async (contract) => {
    if (contract.events) {
        const response = await client.graphql({query: queries.getContract, variables: {
            "id": contract.id
        }});
        const currentContract = response.data.getContract;
        const currentEvents = currentContract.events || [];
        contract.events = [
            ...currentEvents,
            ...contract.events.filter(e => currentEvents.findIndex(ce => e.createdAt === ce.createdAt) === -1)
        ];
    }

    await client.graphql({query: mutations.updateContract, variables: {
        "input": contract
    }});
}

const client = generateClient();

export {
    generateAssociationSecret,
    trackEvent,
    doUpdateContract,
    client
}