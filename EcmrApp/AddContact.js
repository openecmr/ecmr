import React, {Component} from "react";
import {Alert, FlatList, Image, ListView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {InputRow, MyText} from "./Components";
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
        const {route} = props;
        this.state = {
            addressName: route.params.addressName,
            addressId: route.params.addressId,
            owner: route.params.owner,
            driverId: route.params.driverDriverId
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    flexDirection: "row",
                    paddingStart: 10,
                    paddingEnd: 10,
                    paddingTop: 15,
                    paddingBottom: 15,
                    alignItems: "center",
                    backgroundColor: 'rgb(229, 229, 229)'
                }}>
                    <Icon name={"warehouse"} size={20} style={{width: 30, marginEnd: 15}}/>
                    <MyText style={{marginEnd: 30}}>{I18n.get("Address")}</MyText>
                    <MyText style={{textAlign: "right", flex: 1, fontWeight: "bold"}}>{this.state.addressName}</MyText>
                </View>
                <View style={{backgroundColor: 'white',}}>
                    <InputRow value={this.state.name} placeholder={I18n.get("e.g. John Smith...")}
                              onChangeText={(name) => this.setState({name})}
                              label={I18n.get("Name")}
                              icon={"user-alt"}
                              autoCapitalize={"words"}
                              required={true}
                    />
                    <InputRow value={this.state.email} placeholder={I18n.get("e.g. john@smith.com...")}
                              onChangeText={(email) => this.setState({email})}
                              label={I18n.get("Email")}
                              icon={"envelope"}
                              keyboardType={"email-address"}
                              autoCapitalize={"none"}
                              autoCompleteType={"email"}
                              autoCorrect={false}
                    />
                    <InputRow value={this.state.phone} placeholder={I18n.get("e.g. +3112345678")}
                              onChangeText={(phone) => this.setState({phone})}
                              label={I18n.get("Phone")}
                              icon={"phone"}
                              keyboardType={"phone-pad"}
                              autoCapitalize={"none"}
                              autoCompleteType={"tel"}
                              autoCorrect={false}
                    />
                </View>
                <Button containerStyle={{position: "absolute", start: 10, bottom: 10, end: 10}}
                        title={I18n.get("Add contact")}
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
            photos: this.props.route.params.photos
        });
    }
}

export default AddContact;