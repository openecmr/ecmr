import {Component} from "react";
import React from "react";
import {MyText} from "./Components";
import {View, TextInput, Text, Alert, StyleSheet} from "react-native";
import {Button} from "react-native-elements";
import {I18n} from "aws-amplify";
import * as EmailValidator from 'email-validator';

export default class SignatoryInformation extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: I18n.get('Signatory information')
    });

    constructor(props) {
        super(props);
        this.state = {
            signatoryName: '',
            signatoryEmail: '',
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site")
        };
    }

    render() {
        return (

            <View style={{flex: 1}}>
                <Text style={{padding: 10, color: 'rgb(0, 115, 209)', fontSize: 25, paddingBottom: 10}}>{I18n.get("Please enter the details of the signatory:")}</Text>
                <View style={{padding: 10, flex: 1, flexDirection: 'column', paddingTop: 0}}>


                    <MyText>{I18n.get("Name of signatory")}</MyText>
                    <TextInput
                        value={this.signatoryName}
                        style={styles.textInput}
                        placeholder={I18n.get("e.g. John Smith...")}
                        onChangeText={(signatoryName) => this.setState({signatoryName})}/>
                    <MyText>{I18n.get("Email of signatory (optional)")}</MyText>

                    <TextInput
                        autoCapitalize={"none"}
                        autoCompleteType={"email"}
                        keyboardType={"email-address"}
                        value={this.signatoryEmail}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5}}
                        placeholder={I18n.get("e.g. john@smith.com...")}
                        onChangeText={(signatoryEmail) => this.setState({signatoryEmail})}/>
                    <MyText style={{color: "#808080"}}>{I18n.get("A copy of the consignment note will be delivered to this address")}</MyText>
                    <Button
                        buttonStyle={{height: 60, backgroundColor: "rgb(60,176,60)", marginTop: 15}}
                        title={I18n.get("Save")}
                        onPress={() => this.save()}/>
                </View>
            </View>);
    }

    save() {
        if (!this.state.signatoryName) {
            Alert.alert(
                I18n.get('Required information'),
                I18n.get('Please enter the name of the signatory'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            return;
        }

        if (this.state.signatoryEmail && !EmailValidator.validate(this.state.signatoryEmail)) {
            Alert.alert(
                I18n.get('Email invalid'),
                I18n.get('Please enter a valid email address'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            return;
        }

        const {navigate} = this.props.navigation;
        navigate('Signature', {
            item: this.state.contract,
            site: this.state.site,
            signatoryEmail: this.state.signatoryEmail,
            signatoryName: this.state.signatoryName,
            photos: this.props.navigation.getParam("photos")
        });
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 15
    }
});