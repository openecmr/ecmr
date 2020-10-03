import React, {Component} from "react";
import {Alert, FlatList, Image, ListView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {MyText} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as mutations from "./graphql/mutations"
import * as EmailValidator from "email-validator";


class AddContact extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: I18n.get('Add contact')
    });

    constructor(props) {
        super(props);
        this.state = {
            addressName: props.navigation.getParam("addressName"),
            addressId: props.navigation.getParam("addressId"),
            owner: props.navigation.getParam("owner"),
            driverId: props.navigation.getParam("driverDriverId")
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flexDirection: "row", paddingStart: 10, paddingEnd: 10, paddingTop: 15, paddingBottom: 15, alignItems: "center", backgroundColor: 'rgb(229, 229, 229)'}}>
                    <Icon name={"warehouse"} size={20} style={{width: 30, marginEnd: 15}}/>
                    <MyText style={{marginEnd: 30}}>Address</MyText>
                    <MyText style={{textAlign: "right", flex: 1, fontWeight: "bold"}}>{this.state.addressName}</MyText>
                </View>
                <View style={{backgroundColor: 'white', }}>
                    <View style={{flexDirection: "row", marginTop: 5, alignItems: "center", padding: 10,  borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgb(200, 200, 200)'}}>
                        <Icon size={20} style={{textAlign: "center", width: 30, marginEnd: 15}} name={"user-alt"}/>
                        <MyText>Name</MyText>
                        <TextInput
                            autoCapitalize={"words"}
                            value={this.state.name}
                            style={{...styles.textInput, flex: 1, marginLeft: 10}}
                            placeholder={I18n.get("e.g. John Smith...")}
                            onChangeText={(name) => this.setState({name})}/>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 5, padding: 10, alignItems: "center", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgb(200, 200, 200)'}}>
                        <Icon size={20} style={{textAlign: "center", width: 30, marginEnd: 15}} name={"envelope"}/>
                        <MyText>Email</MyText>
                        <TextInput
                            keyboardType={"email-address"}
                            autoCapitalize={"none"}
                            autoCompleteType={"email"}
                            autoCorrect={false}
                            value={this.state.email}
                            style={{...styles.textInput, flex: 1, marginLeft: 15}}
                            placeholder={I18n.get("e.g. john@smith.com...")}
                            onChangeText={(email) => this.setState({email})}/>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 5, padding: 10, alignItems: "center", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgb(200, 200, 200)'}}>
                        <Icon size={20} style={{textAlign: "center", width: 30, marginEnd: 15}} name={"phone"}/>
                        <MyText>Phone</MyText>
                        <TextInput
                            keyboardType={"phone-pad"}
                            autoCapitalize={"none"}
                            autoCompleteType={"tel"}
                            autoCorrect={false}
                            value={this.signatoryName}
                            style={{...styles.textInput, flex: 1, marginLeft: 15}}
                            placeholder={I18n.get("e.g. +3112345678")}
                            onChangeText={(phone) => this.setState({phone})}/>
                    </View>
                </View>
                <Button containerStyle={{position: "absolute", start: 10, bottom: 10, end: 10}} title={I18n.get("Add contact")}
                        buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                        loading={this.state.loading}
                        onPress={() => this.addContact()}/>
            </View>
        )
    }

    async addContact() {
        if (!this.validate()) {
            return;
        }

        this.setState({
            loading: true
        });
        const {name, email, phone, addressId, owner, driverId} = this.state;
        try {
            await API.graphql(graphqlOperation(mutations.createContactPerson, {
                input: {
                    name,
                    email,
                    phone,
                    owner,
                    contactId: addressId,
                    addedByDriverDriverId: driverId
                }
            }));
            this.finish(name);
        } catch (ex) {
            if (ex.data && ex.data.createContactPerson) {
                this.finish(name);
            } else {
                Alert.alert(
                    I18n.get('Error while adding contact'),
                    I18n.get('You do not have permission to the address book. Please use manual entry.'),
                    [
                        {text: I18n.get('OK')}
                    ],
                    {cancelable: true}
                );
            }
        }
        this.setState({
            loading: false
        });
    }

    finish(name) {

        this.props.navigation.goBack();
    }

    validate() {
        let result = true;
        if (!this.state.name) {
            Alert.alert(
                I18n.get('Required information'),
                I18n.get('Please enter the name of the contact'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            result = false;
        } else if (this.state.email && !EmailValidator.validate(this.state.email)) {
            Alert.alert(
                I18n.get('Email invalid'),
                I18n.get('Please enter a valid email address'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            result = false;
        }
        return result;
    }

    selectContact(contact) {
        const {navigate} = this.props.navigation;
        navigate('Signature', {
            item: this.state.contract,
            site: this.state.site,
            signatoryEmail: contact.email,
            signatoryName: contact.name,
            photos: this.props.navigation.getParam("photos")
        });
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,

        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    baseContainer: {
        flex: 1, padding: 10
    },
});



export default AddContact;