import React, {Component} from "react";
import {Alert, FlatList, Image, ListView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {MyText} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as mutations from "./graphql/mutations"
import * as EmailValidator from "email-validator";

function TransportItem({label, value, icon, required, onPress = () => {}}) {
    return (
        <TouchableOpacity style={{flexDirection: "row", marginTop: 5, alignItems: "center",
            padding: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgb(200, 200, 200)'}}
                          onPress={onPress}>
            <Icon size={20} style={{textAlign: "center", width: 30, marginEnd: 15}} name={icon}/>
            <MyText style={{textTransform: "capitalize"}}>{label}</MyText>{required && <MyText style={{color: "red"}}>*</MyText>}
            {value && <MyText style={{textAlign: "right", fontWeight: "bold", flex: 1, marginRight: 50}}>{value}</MyText>}
        </TouchableOpacity>);
}

function AddressItem({value, ...rest}) {
    return (
        <TransportItem value={value  && value.name} {...rest} />);
}

class AddTransportScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: 'white'}}>
                    <AddressItem label={I18n.get("carrier")} value={this.state.carrier} icon={"building"} required
                                   onPress={() => this.selectAddress("carrier")}/>
                    <TransportItem label={I18n.get("truck")} onPress={() => this.selectVehicle("truck")} value={this.state.truck && this.state.truck.licensePlateNumber} icon={"truck"} required/>
                    <TransportItem label={I18n.get("trailer")} value={this.state.trailer} icon={"truck"} />
                </View>
                <View style={{backgroundColor: 'white', marginTop: 5}}>
                    <TransportItem label={I18n.get("No load added")} icon={"archive"}/>
                    <TransportItem label={I18n.get("Add load")} icon={"plus"}/>
                </View>
                <View style={{backgroundColor: 'white', marginTop: 5}}>
                    <AddressItem label={I18n.get("shipper")} value={this.state.shipper} icon={"building"} required
                                   onPress={() => this.selectAddress("shipper")}/>
                    <AddressItem label={I18n.get("pickup")} value={this.state.pickup} icon={"sign-out-alt"} required
                                   onPress={() => this.selectAddress("pickup")}/>
                    <AddressItem label={I18n.get("delivery")} value={this.state.delivery} icon={"sign-in-alt"} required
                                   onPress={() => this.selectAddress("delivery")}/>
                </View>
                <Button containerStyle={{position: "absolute", start: 10, bottom: 10, end: 10}} title={I18n.get("Save")}
                        buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                        loading={this.state.loading}
                        onPress={() => this.addContact()}/>
            </View>
        )
    }

    selectVehicle(key) {
        const {navigate} = this.props.navigation;
        navigate('SelectVehicle', {
            vehicleType: key.toUpperCase(),
            label: I18n.get(key),
            onSelect: (vehicle) => {
                this.setState({
                    [key]: vehicle
                })
            }
        });
    }

    selectAddress(key) {
        const {navigate} = this.props.navigation;
        navigate('SelectAddress', {
            label: I18n.get(key),
            onSelect: (address) => {
                this.setState({
                    [key]: address
                })
            }
        });
    }
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