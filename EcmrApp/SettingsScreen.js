import {Component} from "react";
import React from "react";
import {MyText} from "./Components";
import {Button, View} from "react-native";
import { Auth } from 'aws-amplify';

class SettingsScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{padding: 10}}>
                <MyText style={{marginBottom: 10}}>Settings</MyText>
                <Button title={"Logout"} color={"rgb(60,176,60)"} onPress={() => this.logout()}/>
            </View>);
    }

    async logout() {
        const {navigate} = this.props.navigation;
        await Auth.signOut();
        this.props.onStateChange('signIn',{});
    }
}

export default SettingsScreen;