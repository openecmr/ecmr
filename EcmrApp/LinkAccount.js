import {Modal, View, TextInput, StyleSheet, Alert} from "react-native";
import {MyText} from "./Components";
import React from "react";
import {Component} from "react";
import {API, graphqlOperation, I18n} from "aws-amplify";
import * as mutations from "./graphql/mutations";
import {Button, Divider} from "react-native-elements";
import {Auth} from "@aws-amplify/auth";

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: '',
            codeValid: false
        }
    }

    render() {
        const {loading} = this.state;
        return (
            <View style={{marginTop: 22}}>
                <View style={{padding: 10}}>
                    <MyText>{I18n.get('Please enter the activation code that you received from the company to which you want to link')}</MyText>

                    <TextInput
                        autoCapitalize={"none"}
                        keyboardType={"default"}
                        autoCompleteType={"off"}
                        value={this.state.code}
                        autoFocus={true}
                        style={{...styles.textInput, alignSelf: "center", width: 100, marginTop: 5, marginBottom: 15, fontSize: 20}}
                        onChangeText={(code) => {
                            const validated = code.substr(0, 6);
                            this.setState({
                                code: validated,
                                codeValid: validated.length === 6
                            })
                        }}/>

                    <Button title={I18n.get('Link account')}
                            disabled={!this.state.codeValid}
                            loading={loading} buttonStyle={{backgroundColor: 'rgb(60,176,60)'}} onPress={() => this.activate()} />
                </View>
            </View>);
    }

    async activate() {
        try {
            this.setState({
                loading: true
            });
            const result = await API.graphql(graphqlOperation(mutations.activate, {activationCode: this.state.code.toUpperCase()}));
            if (result.data.activate === "success") {

                Alert.alert(
                    I18n.get('Success'),
                    I18n.get('Successfully linked account. The company can now assign transports to you.'),
                    [
                        {text: I18n.get('OK'), onPress: () => this.props.navigation.goBack()}
                    ],
                    {cancelable: false}
                );
                const cognitoUser = await Auth.currentAuthenticatedUser();
                const currentSession = await Auth.currentSession();
                cognitoUser.refreshSession(currentSession.refreshToken, (err, session) => {

                });
            } else {
                this.showError();
            }
        } catch(ex) {
            this.showError();
        } finally {
            this.setState({
                loading: false
            })
        }
    }

    showError() {
        Alert.alert(
            I18n.get('Error'),
            I18n.get('Invalid link code, please check the code and try again.'),
            [
                {text: I18n.get('OK')}
            ],
            {cancelable: true}
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 60,
        borderStyle: "dotted",
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    }
});
