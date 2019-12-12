import {Button, Modal, View, TextInput} from "react-native";
import {MyText} from "./Components";
import React from "react";
import {Component} from "react";
import {API, graphqlOperation} from "aws-amplify";
import * as mutations from "./graphql/mutations";

export default class SettingsScreen extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Link account'
    });

    constructor(props) {
        super(props);

        this.state = {
            code: ''
        }
    }

    render() {
        return (
            <View style={{marginTop: 22}}>
                <View style={{padding: 10}}>
                    <MyText>Please enter the activation code that you received from the company to which you want to
                        link</MyText>

                    {this.state.success && <MyText>Successfully linked account</MyText>}
                    {this.state.error && <MyText>Invalid link code, please check the code and try again.</MyText>}

                    <TextInput
                        value={this.code}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 15}}
                        placeholder="Enter code..."
                        onChangeText={(code) => this.setState({code})}/>
                    <Button
                        title={"Link account"}
                        onPress={() => this.activate()}/>
                </View>
            </View>);
    }

    async activate() {
        try {
            this.setState({
                success: false,
                error: false
            });
            const result = await API.graphql(graphqlOperation(mutations.activate, {activationCode: this.state.code}));
            if (result.data.activate === "success") {
                this.setState({
                    success: true
                });
            } else {
                this.setState({
                    error: true
                })
            }
        } catch(ex) {
            console.log(ex);
        }
    }
}