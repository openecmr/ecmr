import {API, Auth, graphqlOperation, Hub, I18n, Storage} from "aws-amplify";
import * as mutations from "./graphql/mutations";
import moment from "moment";
import UUIDGenerator from "react-native-uuid-generator";
import * as queries from "./graphql/queries";
import Geolocation from "react-native-geolocation-service";
import {Alert, PermissionsAndroid} from "react-native";
import DefaultPreference from 'react-native-default-preference';

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

async function locationPermissions() {
    const allowLocation = await DefaultPreference.get('allowLocation');
    if (allowLocation === 'false') {
        return false;
    }
    if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)) {
        return true;
    }
    if (allowLocation === null) {
        const allow = await new Promise((resolve) => Alert.alert(
            I18n.get('Location permissions'),
            I18n.get('Do you want to share your current location in the confirmation? You can always change this in the settings menu.'),
            [
                {
                    text: I18n.get('No'),
                    onPress: () => resolve(false),
                    style: 'cancel',
                },
                {text: I18n.get('Share location'), onPress: () => resolve(true)}
            ],
            {cancelable: true}
        ));
        if (!allow) {
            await DefaultPreference.set('allowLocation', 'false');
            return false;
        } else {
            await DefaultPreference.set('allowLocation', 'true')
        }
    }
    return await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: I18n.get("Location permissions"),
            message:
                I18n.get("Do you want to share your current location in the confirmation?"),
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
    ) === PermissionsAndroid.RESULTS.GRANTED;
}

const geoUtil = {
    locationPermissions,
    async getCurrentPosition() {
        const hasLocationPermission = await locationPermissions();
        if (hasLocationPermission) {
            return await new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        resolve(position);
                    },
                    (error) => {
                        console.warn("cannot get geoposition", error);
                        resolve();
                    },
                    {enableHighAccuracy: true, timeout: 1500, maximumAge: 10000, showLocationDialog: true}
                );
            });
        } else {
            return null;
        }
    },
    toGeoPosition(geoposition) {
        const {
            latitude,
            longitude,
            accuracy,
            altitude,
            heading,
            speed,
            altitudeAccuracy
        } = geoposition.coords;
        return {
            latitude,
                longitude,
                accuracy,
                altitude,
                heading,
                speed,
                altitudeAccuracy,
                timestamp: geoposition.timestamp,
            mocked: geoposition.mocked,
            provider: geoposition.provider
        };
    }
}

export {
    geoUtil,
    createUpdateContractInput,
    updateContract,
    uploadPhotos
}