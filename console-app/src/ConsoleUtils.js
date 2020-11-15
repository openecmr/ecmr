import ReactGA from "react-ga";

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

export {
    generateAssociationSecret,
    trackEvent
}