import {Component} from "react";
import React from "react";
import {MyText} from "./Components";
import {View, Modal, TouchableHighlight, Linking, Switch, StyleSheet} from "react-native";
import {Button} from "react-native-elements";
import {API, Auth, graphqlOperation, I18n} from 'aws-amplify';
import {resetCompanyCheck} from "./Transports";
import DefaultPreference from "react-native-default-preference";
import {getDriverSignatureImage, geoUtil} from "./DataUtil";
import {actionButtonColor} from "./Transport";
import {S3Image} from "aws-amplify-react-native/src/Storage";
import * as queries from "./graphql/queries";


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
        const {user, allowLocation, mySignatureImage} = this.state;

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
                    <Button title={I18n.get("Link to company")} buttonStyle={styles.actionButton} onPress={() => this.linkToCompany()}/>
                </View>
                <View style={{flexDirection: "row", marginTop: 25}}>
                    <MyText style={{flex: 1}}>{I18n.get("Allow Open eCMR to add your current location to events")}</MyText><Switch value={allowLocation} onChange={this.toggleAllowLocation}/>
                </View>
                <View style={{marginTop: 10}}>
                    <MyText style={{fontSize: 15}}>{I18n.get("My signature")}</MyText>
                    <View style={{alignItems: "center"}}>
                        {mySignatureImage && <S3Image style={{width: 150, height: 150, marginTop: 10, marginBottom: 10, borderRadius: 5, borderWidth: 2, borderColor: 'rgb(187,187,187)'}}
                                                         resizeMode={'center'}
                                                         level={"public"}
                                                         imgKey={mySignatureImage.key} />}
                        {!mySignatureImage && <MyText style={{fontStyle: 'italic'}}>{I18n.get("No signature set")}</MyText>}
                    </View>
                    <Button title={I18n.get("Edit my signature")} buttonStyle={styles.actionButton} onPress={() => this.editSignature()}/>
                </View>
                <View style={{marginTop: 25}}>
                    <Button title={I18n.get("Visit the Open e-CMR portal")} buttonStyle={styles.actionButton} onPress={() => {Linking.openURL("https://app.openecmr.com/?utm_source=app")}} containerStyle={{marginTop: 25}} />
                </View>
                <MyText style={{marginBottom: 10, marginTop: 25}}>{I18n.get('Session')}</MyText>
                <View>
                    <Button title={I18n.get("Logout")} buttonStyle={styles.actionButton} onPress={() => this.logout()} containerStyle={{marginTop: 25}} />
                </View>
            </View>);
    }

    async componentDidMount() {
        const user = await Auth.currentAuthenticatedUser();
        const mySignatureImage = await getDriverSignatureImage(user);
        this.setState({
            user,
            allowLocation: (await DefaultPreference.get('allowLocation')) === 'true',
            mySignatureImage
        });
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

    editSignature() {
        const {navigate} = this.props.navigation;
        navigate('EditMySignature');
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
}

const styles = StyleSheet.create({
    actionButton: {
        backgroundColor: actionButtonColor
    }
});

export default SettingsScreen;