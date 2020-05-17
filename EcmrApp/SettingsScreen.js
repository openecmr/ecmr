import {Component} from "react";
import React from "react";
import {MyText} from "./Components";
import {Button, View, Modal, TouchableHighlight} from "react-native";
import {Auth, I18n} from 'aws-amplify';

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
                <MyText style={{marginBottom: 10}}>{I18n.get('Account')}</MyText>
                <MyText style={{marginBottom: 20}}>{
                    I18n.get('Logged in as ${username} (email: ${email}, verified: ${verified})')
                        .replace('${username}', user.username)
                        .replace('${email}', user.attributes['email'])
                        .replace("${verified}", user.attributes['email_verified'] ? I18n.get("yes") : I18n.get("no"))}
                </MyText>

                <MyText style={{marginBottom: 10}}>{I18n.get('Settings')}</MyText>
                <View>
                    <Button title={I18n.get("Link to company")} color={"rgb(60,176,60)"} onPress={() => this.linkToCompany()}/>
                </View>
                <View style={{marginTop: 25}}>
                    <Button title={I18n.get("Logout")} color={"rgb(60,176,60)"} onPress={() => this.logout()} containerStyle={{marginTop: 25}} />
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