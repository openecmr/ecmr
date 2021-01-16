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

function AddTransportScreen({navigation, navigation: {navigate}}) {
    const [document, setDocument] = useState({
        loads: []
    });
    const [loading, setLoading] = useState(false);
    const company = navigation.getParam("company");

    function selectVehicle(key) {
        navigate('SelectVehicle', {
            vehicleType: key.toUpperCase(),
            label: I18n.get(key),
            companyOwner: company.owner,
            onSelect: (vehicle) => {
                setDocument({
                    ...document,
                    [key]: vehicle,
                });
            }
        });
    }

    function selectAddress(key, label) {
        navigate('SelectAddress', {
            label,
            companyOwner: company.owner,
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

            const driverResponse = await API.graphql(graphqlOperation(queries.driverByOwner, {owner: company.owner}));
            const driver = driverResponse.data.driverByOwner.items.find(d => d.carrier === username);
            if (!driver) {
                console.warn("no driver: " + driver);
                return;
            }
            const now = moment().toISOString();
            const request = {
                shipper: copyAddress(document.shipper),
                carrier: copyAddress(document.carrier),
                delivery: copyAddress(document.delivery),
                pickup: copyAddress(document.pickup),
                loads: document.loads,
                owner: company.owner,
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
                driver: {
                    name: driver.name,
                    username: username,
                },
                truck: document.truck.licensePlateNumber,
                ...(document.trailer && {
                    trailer: document.trailer.licensePlateNumber,
                    trailerVehicleId: document.trailer.id
                }),
                arrivalDate: moment().format("YYYY-MM-DD"),
                deliveryDate: moment().format("YYYY-MM-DD"),
                createdAt: now,
                updatedAt: now,
                needAcknowledge: false,
                creator: {
                    name: company.name
                },

                shipperContactId: document.shipper.id,
                carrierContactId: document.carrier.id,
                deliveryContactId: document.delivery.id,
                pickupContactId: document.pickup.id,
                driverDriverId: driver.id,
                truckVehicleId: document.truck.id,
                creatorCompanyId: company.id
            };
            const result = await API.graphql(graphqlOperation(mutations.createContractCustom, {input: request}));
            navigation.popToTop();
            navigate('Transport', {
                item: result.data.createContractCustom,
                site: 'pickup'
            });
        } catch (ex) {
            console.warn(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <View style={{backgroundColor: 'white', marginTop: 5}}>
                    <TransportItem label={I18n.get("Submitter")} value={company.name} icon={"building"}/>
                </View>

                <View style={{backgroundColor: 'white', marginTop: 5}}>
                    <AddressItem label={I18n.get("carrier")} value={document.carrier} icon={"building"} required
                                 onPress={() => selectAddress("carrier", I18n.get("Select carrier"))}/>
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
                                 onPress={() => selectAddress("shipper", I18n.get("Select shipper"))}/>
                    <AddressItem label={I18n.get("pickup")} value={document.pickup} icon={"sign-out-alt"} required
                                 onPress={() => selectAddress("pickup", I18n.get("Select pickup address"))}/>
                    <AddressItem label={I18n.get("delivery")} value={document.delivery} icon={"sign-in-alt"} required
                                 onPress={() => selectAddress("delivery", I18n.get("Select delivery address"))}/>
                </View>
            </ScrollView>
            <Button containerStyle={{position: "absolute", start: 10, bottom: 10, end: 10}} title={I18n.get("Save")}
                    buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                    loading={loading}
                    onPress={save}/>
        </View>
    )
}

export default AddTransportScreen;