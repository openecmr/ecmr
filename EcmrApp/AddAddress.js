import React, {Component} from "react";
import {
    Alert,
    ScrollView,
    View
} from "react-native";
import {InputRow} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as mutations from "./graphql/mutations"
import * as EmailValidator from "email-validator";

class AddAddress extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.getParam('editAddress') ? I18n.get('Edit address') : I18n.get('Add address')
    });

    constructor(props) {
        super(props);

        const editAddress = props.navigation.getParam("editAddress");
        this.state = {
            companyOwner: props.navigation.getParam("companyOwner"),
            editing: !!editAddress,
            ...editAddress
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{marginBottom: 50}}>
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
                        <InputRow value={this.state.postalCode} placeholder={I18n.get("e.g. 1234...")}
                                  onChangeText={(postalCode) => this.setState({postalCode})}
                                  label={I18n.get("Postal code")}
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
                </ScrollView>
                <Button containerStyle={{position: "absolute", start: 0, bottom: 0, end: 0}}
                        title={this.state.editing ? I18n.get("Edit address") : I18n.get("Add address")}
                        buttonStyle={{height: 40, backgroundColor: 'rgb(60,176,60)'}}
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
        const {name, email, phone, postalCode, address, city, country, companyOwner} = this.state;
        try {
            const username = (await Auth.currentAuthenticatedUser()).getUsername();
            const operation = this.state.editing ? mutations.updateContact : mutations.createContact;
            await API.graphql(graphqlOperation(operation, {
                input: {
                    ...(this.state.editing && {id: this.state.id}),
                    owner: companyOwner,
                    createdBy: username,
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
                console.info(ex);
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