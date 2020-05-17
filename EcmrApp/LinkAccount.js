import { Modal, View, TextInput} from "react-native";
import {MyText} from "./Components";
import React from "react";
import {Component} from "react";
import {API, graphqlOperation, I18n} from "aws-amplify";
import * as mutations from "./graphql/mutations";
import {Button, Divider} from "react-native-elements";

export default class SettingsScreen extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: I18n.get('Link account')
    });

    constructor(props) {
        super(props);

        this.state = {
            code: ''
        }
    }

    render() {
        const {loading} = this.state;
        return (
            <View style={{marginTop: 22}}>
                <View style={{padding: 10}}>
                    <MyText>{I18n.get('Please enter the activation code that you received from the company to which you want to link')}</MyText>

                    {this.state.success && <MyText style={{backgroundColor: '#DBFF70', padding: 5, borderRadius: 5}}>{I18n.get('Successfully linked account')}</MyText>}
                    {this.state.error && <MyText style={{backgroundColor: '#FFBA09', padding: 5, borderRadius: 5}}>{I18n.get('Invalid link code, please check the code and try again.')}</MyText>}

                    <TextInput
                        value={this.code}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 15}}
                        placeholder={I18n.get('Enter code...')}
                        onChangeText={(code) => this.setState({code})}/>

                    <Button title={I18n.get('Link account')}
                            loading={loading} buttonStyle={{backgroundColor: 'rgb(60,176,60)'}} onPress={() => this.activate()} />
                </View>
            </View>);
    }

    async activate() {
        try {
            this.setState({
                loading: true,
                success: false,
                error: false
            });
            const result = await API.graphql(graphqlOperation(mutations.activate, {activationCode: this.state.code.toUpperCase()}));
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
            this.setState({
                error: true
            })
        } finally {
            this.setState({
                loading: false
            })
        }
    }
}