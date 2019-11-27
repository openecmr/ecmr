import {Button, Modal, View, TextInput} from "react-native";
import {MyText} from "./Components";
import React from "react";
import {Component} from "react";

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

                    <TextInput
                        value={this.code}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 15}}
                        placeholder="Enter code..."
                        onChangeText={(code) => this.setState({code})}/>
                    <Button
                        title={"Link account"}
                        onPress={() => {

                        }}/>
                </View>
            </View>);
    }
}