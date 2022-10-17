import {Component} from "react";
import React from "react";
import {MyText} from "./Components";
import {Button, View, Modal, TouchableHighlight, Linking, Switch} from "react-native";
import {Auth, I18n} from 'aws-amplify';
import {resetCompanyCheck} from "./Transports";
import DefaultPreference from "react-native-default-preference";
import {geoUtil} from "./DataUtil";


class SettingsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            user: {
                attributes: {}
            }
        }
        this.toggleAllowLocation = this.toggleAllowLocation.bind(this);
    }

    render() {
        const {user, allowLocation} = this.state;

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
                <View style={{flexDirection: "row", marginTop: 25}}>
                    <MyText style={{flex: 1}}>{I18n.get("Allow Open eCMR to add your current location to events")}</MyText><Switch value={allowLocation} onChange={this.toggleAllowLocation}/>
                </View>
                <View style={{marginTop: 25}}>
                    <Button title={I18n.get("Visit the Open e-CMR portal")} color={"rgb(60,176,60)"} onPress={() => {Linking.openURL("https://app.openecmr.com/?utm_source=app")}} containerStyle={{marginTop: 25}} />
                </View>
                <MyText style={{marginBottom: 10, marginTop: 25}}>{I18n.get('Session')}</MyText>
                <View>
                    <Button title={I18n.get("Logout")} color={"rgb(60,176,60)"} onPress={() => this.logout()} containerStyle={{marginTop: 25}} />
                </View>
            </View>);
    }

    async componentDidMount() {
        this.setState({
            user: await Auth.currentAuthenticatedUser(),
            allowLocation: (await DefaultPreference.get('allowLocation')) === 'true'
        })
    }

    async logout() {
        const {navigate} = this.props.navigation;
        await Auth.signOut();
        this.props.onStateChange('signIn',{});

        resetCompanyCheck();
    }

    async toggleAllowLocation() {
        const newValue = !this.state.allowLocation;
        if (newValue) {
            await DefaultPreference.set('allowLocation', 'true');
            await geoUtil.locationPermissions();
        } else {
            await DefaultPreference.set('allowLocation', 'false');
        }
        this.setState({
           allowLocation: newValue
        });
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