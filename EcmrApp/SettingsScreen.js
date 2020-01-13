import {Component} from "react";
import React from "react";
import {MyText} from "./Components";
import {Button, View, Modal, TouchableHighlight} from "react-native";
import { Auth } from 'aws-amplify';

class SettingsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            user: {
                attributes: {}
            }
        }
    }

    render() {
        const {user} = this.state;

        return (
            <View style={{padding: 10}}>
                <MyText style={{marginBottom: 10}}>Account</MyText>
                <MyText style={{marginBottom: 20}}>Logged in as {user.username} (email: {user.attributes['email']},
                    verified: {user.attributes['email_verified'] ? "yes" : "no"})</MyText>

                <MyText style={{marginBottom: 10}}>Settings</MyText>
                <View>
                    <Button title={"Link to company"} color={"rgb(60,176,60)"} onPress={() => this.linkToCompany()}/>
                </View>
                <View style={{marginTop: 25}}>
                    <Button title={"Logout"} color={"rgb(60,176,60)"} onPress={() => this.logout()} containerStyle={{marginTop: 25}} />
                </View>
            </View>);
    }

    async componentDidMount() {
        this.setState({
            user: await Auth.currentAuthenticatedUser()
        })
    }

    async logout() {
        const {navigate} = this.props.navigation;
        await Auth.signOut();
        this.props.onStateChange('signIn',{});
    }

    linkToCompany() {
        const {navigate} = this.props.navigation;
        navigate('LinkAccount');
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
}

export default SettingsScreen;