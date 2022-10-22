import ReactGA from "react-ga";
import {API, graphqlOperation} from "aws-amplify";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";

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

    await API.graphql(graphqlOperation(mutations.updateContract, {
        "input": contract
    }));
}

export {
    generateAssociationSecret,
    trackEvent,
    doUpdateContract
}