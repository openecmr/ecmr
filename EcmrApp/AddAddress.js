import React, {Component} from "react";
import {Alert, FlatList, Image, ListView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {InputRow, MyText} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as mutations from "./graphql/mutations"
import * as EmailValidator from "email-validator";

class AddAddress extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: I18n.get('Add address')
    });

    constructor(props) {
        super(props);
        this.state = {
            ownerCompany: props.navigation.getParam("ownerCompany")
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: 'white',}}>
                    <InputRow value={this.state.name} placeholder={I18n.get("e.g. Some Company...")}
                              onChangeText={(name) => this.setState({name})}
                              label={I18n.get("Name")}
                              icon={"warehouse"}
                              autoCapitalize={"words"}
                              required={true}
                    />
                    <InputRow value={this.state.address} placeholder={I18n.get("e.g. Oxfordstreet 22...")}
                              onChangeText={(address) => this.setState({address})}
                              label={I18n.get("Address")}
                              icon={"envelope"}
                              autoCapitalize={"words"}
                    />
                    <InputRow value={this.state.city} placeholder={I18n.get("e.g. London...")}
                              onChangeText={(city) => this.setState({city})}
                              label={I18n.get("City")}
                              icon={"city"}
                              autoCapitalize={"words"}
                    />
                    <InputRow value={this.state.country} placeholder={I18n.get("e.g. United Kingdom...")}
                              onChangeText={(country) => this.setState({country})}
                              label={I18n.get("Country")}
                              icon={"flag"}
                              autoCapitalize={"words"}
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
                    <InputRow value={this.state.email} placeholder={I18n.get("e.g. john@smith.com...")}
                              onChangeText={(email) => this.setState({email})}
                              label={I18n.get("Email")}
                              icon={"envelope"}
                              keyboardType={"email-address"}
                              autoCapitalize={"none"}
                              autoCompleteType={"email"}
                              autoCorrect={false}
                    />
                </View>
                <Button containerStyle={{position: "absolute", start: 10, bottom: 10, end: 10}}
                        title={I18n.get("Add address")}
                        buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                        loading={this.state.loading}
                        onPress={() => this.addAddress()}/>
            </View>
        )
    }

    async addAddress() {
        if (!this.validate()) {
            return;
        }

        this.setState({
            loading: true
        });
        const {name, email, phone, postalCode, address, city, country, owner, driverId} = this.state;
        try {
            await API.graphql(graphqlOperation(mutations.createContact, {
                input: {
                    owner,
                    name,
                    postalCode,
                    address,
                    city,
                    country,
                    phone,
                    email
                }
            }));
            this.finish(name);
        } catch (ex) {
            if (ex.data && ex.data.createContact) {
                this.finish(name);
            } else {
                Alert.alert(
                    I18n.get('Error while adding address'),
                    I18n.get('You do not have permission to the address book.'),
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
                I18n.get('Please enter the name of the address'),
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
}

export default AddAddress;