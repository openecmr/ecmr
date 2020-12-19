import React, {Component, useState} from "react";
import {
    Alert,
    FlatList,
    Image,
    ListView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {LoadDetailText, MyText, requiredFieldsAlert} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as mutations from "./graphql/mutations"
import * as EmailValidator from "email-validator";
import moment from "moment";
import * as queries from "./graphql/queries";

function TransportItem({label, value, icon, required, onPress = () => {}, children}) {
    return (
        <TouchableOpacity style={{flexDirection: "row", marginTop: 5, alignItems: "center",
            padding: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgb(200, 200, 200)'}}
                          onPress={onPress}>
            <Icon size={20} style={{textAlign: "center", width: 30, marginEnd: 15}} name={icon}/>
            <MyText style={{textTransform: "capitalize"}}>{label}</MyText>{required && <MyText style={{color: "red"}}>*</MyText>}
            {value && <MyText style={{textAlign: "right", fontWeight: "bold", flex: 1, marginRight: 50}}>{value}</MyText>}
            {children}
        </TouchableOpacity>);
}

function AddressItem({value, ...rest}) {
    return (
        <TransportItem value={value  && value.name} {...rest} />);
}

function AddTransportScreen({navigation: {navigate}}) {
    const [document, setDocument] = useState({
        loads: []
    });
    const [loading, setLoading] = useState(false);

    function selectVehicle(key) {
        navigate('SelectVehicle', {
            vehicleType: key.toUpperCase(),
            label: I18n.get(key),
            onSelect: (vehicle) => {
                setDocument({
                    ...document,
                    [key]: vehicle,
                });
            }
        });
    }

    function selectAddress(key) {
        navigate('SelectAddress', {
            label: I18n.get(key),
            onSelect: (address) => {
                setDocument({
                    ...document,
                    [key]: address,
                });
            }
        });
    }

    function addLoad() {
        navigate('AddLoad', {
            onSave: (load) => {
                setDocument({
                    ...document,
                    loads: [...document.loads, load]
                })
            }
        });
    }

    function editGood(load, index) {
        navigate('AddLoad', {
            editLoad: load,
            onSave: (load) => {
                const loads = [...document.loads]
                loads[index] = load
                setDocument({
                    ...document,
                    loads
                })
            },
            onRemove: (load) => {
                const loads = [...document.loads]
                loads.splice(index, 1);
                setDocument({
                    ...document,
                    loads
                })
            }
        });
    }

    function validate() {
        if (!document.shipper || !document.carrier || !document.truck || !document.delivery ||
                !document.pickup || document.loads.length === 0) {
            requiredFieldsAlert();
            return false;
        }
        return true;
    }

    async function save() {
        if (!validate()) {
            return;
        }

        setLoading(true);

        function copyAddress(address) {
            return {
                name: address.name,
                postalCode: address.postalCode,
                address: address.address,
                city: address.city,
                country: address.country
            }
        }

        try {
            const username = (await Auth.currentAuthenticatedUser()).getUsername();

            const driverResponse = await API.graphql(graphqlOperation(queries.driverByOwner, {owner: username}));
            const driver = driverResponse.data.driverByOwner.items.find(d => d.carrier === username);
            if (!driver) {
                console.warn("no driver: " + driver);
                return;
            }
            const companyResponse = await API.graphql(graphqlOperation(queries.companyByOwner, {owner: username}));
            if (!companyResponse.data.companyByOwner.items.length) {
                console.warn("no company");
                return;
            }
            const company = companyResponse.data.companyByOwner.items[0];


            const now = moment().toISOString();
            const request = {
                shipper: copyAddress(document.shipper),
                carrier: copyAddress(document.carrier),
                delivery: copyAddress(document.delivery),
                pickup: copyAddress(document.pickup),
                loads: document.loads,
                owner: username,
                status: 'CREATED',
                carrierUsername: username,
                events: [
                    {
                        author: {
                            username: username,
                        },
                        type: 'AssignDriver',
                        createdAt: now,
                        assignedDriver: {
                            name: driver.name,
                            username: username
                        }
                    }
                ],
                shipperContactId: document.shipper.id,
                carrierContactId: document.carrier.id,
                deliveryContactId: document.delivery.id,
                pickupContactId: document.pickup.id,
                driver: {
                    name: driver.name,
                    username: username,
                },
                driverDriverId: driver.id,
                truck: document.truck.licensePlateNumber,
                truckVehicleId: document.truck.id,
                ...(document.trailer && {
                    trailer: document.trailer.licensePlateNumber,
                    trailerVehicleId: document.trailer.id
                }),
                arrivalDate: moment().format("YYYY-MM-DD"),
                deliveryDate: moment().format("YYYY-MM-DD"),
                createdAt: now,
                needAcknowledge: false,
                creator: {
                    name: company.name
                }
            };

            console.info(request);

            const result = await API.graphql(graphqlOperation(mutations.createContract, {input: request}));
        } catch (ex) {
            console.warn(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <View style={{backgroundColor: 'white'}}>
                    <AddressItem label={I18n.get("carrier")} value={document.carrier} icon={"building"} required
                                 onPress={() => selectAddress("carrier")}/>
                    <TransportItem label={I18n.get("truck")} onPress={() => selectVehicle("truck")}
                                   value={document.truck && document.truck.licensePlateNumber} icon={"truck"} required/>
                    <TransportItem label={I18n.get("trailer")} onPress={() => selectVehicle("trailer")}
                                   value={document.trailer && document.trailer.licensePlateNumber} icon={"truck"}/>
                </View>
                <View style={{backgroundColor: 'white', marginTop: 5}}>
                    {document.loads.length === 0 && <TransportItem label={I18n.get("No load added")} icon={"archive"}/>}
                    {document.loads.map((l, i) =>
                        <TransportItem onPress={() => editGood(l, i)} key={i} icon={"archive"}>
                            <LoadDetailText load={l}/>
                        </TransportItem>
                    )}
                    <TransportItem label={I18n.get("Add load")} icon={"plus"} onPress={addLoad}/>
                </View>
                <View style={{backgroundColor: 'white', marginTop: 5, marginBottom: 75}}>
                    <AddressItem label={I18n.get("shipper")} value={document.shipper} icon={"building"} required
                                 onPress={() => selectAddress("shipper")}/>
                    <AddressItem label={I18n.get("pickup")} value={document.pickup} icon={"sign-out-alt"} required
                                 onPress={() => selectAddress("pickup")}/>
                    <AddressItem label={I18n.get("delivery")} value={document.delivery} icon={"sign-in-alt"} required
                                 onPress={() => selectAddress("delivery")}/>
                </View>
            </ScrollView>
            <Button containerStyle={{position: "absolute", start: 10, bottom: 10, end: 10}} title={I18n.get("Save")}
                    buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                    loading={loading}
                    onPress={save}/>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        flex: 1,
        marginLeft: 10
    },
    baseContainer: {
        flex: 1, padding: 10
    },
});



export default AddTransportScreen;