import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView, Alert,
    Linking
} from "react-native";
import {Button} from "react-native-elements";
import {Auth, I18n, JS, Logger} from 'aws-amplify';
import {ErrorRow, FormField, LinkCell} from "aws-amplify-react-native";
import AmplifyTheme from "aws-amplify-react-native/dist/AmplifyTheme";
import AmplifyMessageMap from "aws-amplify-react-native/dist/AmplifyMessageMap";

const logger = new Logger('EcmrSignIn');

export default class EcmrSignIn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            action: 'choose',
            signingIn: false
        };

    }

    render() {
        const validStates = ['signIn', 'signedOut', 'signedUp'];
        if (!validStates.includes(this.props.authState)) {
            return null;
        }

        const theme = AmplifyTheme;

        return (

            <View style={{flex: 1, width: '100%', alignItems: 'center', backgroundColor: 'white'}}>
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                        {this.state.action === 'choose' &&
                        <View>
                            <Image style={{marginLeft: 50, width: 50, height: 50}}
                                   source={require('./images/logo.png')}/>
                            <Text style={{fontSize: 30, fontWeight: "bold"}}>Open e-CMR</Text>
                        </View>}

                        {this.state.action === 'choose' &&
                        <View style={{width: '100%', padding: 15}}>
                            <Button title={I18n.get("Create an account with Google")} color={'rgb(60, 167, 60)'} containerStyle={{marginBottom: 10}}
                                    onPress={() => this.googleLogin()}/>
                            <Button title={I18n.get("Create an account using email")} color={'rgb(60, 167, 60)'}
                                    onPress={() => this.changeState("signUp")}/>
                            <Text style={{
                                marginTop: 10,
                                marginBottom: 10, textAlign: "center", fontWeight: "bold",
                                borderBottomColor: "black",
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderColor: "black",
                                borderTopWidth: StyleSheet.hairlineWidth
                            }}>{I18n.get("or")}</Text>
                            <Button containerStyle={{marginBottom: 10}} title={I18n.get("Login with Google")}
                                    onPress={() => this.googleLogin()} color={'rgb(60, 167, 60)'}/>
                            <Button containerStyle={{marginBottom: 10}} style={{}} title={I18n.get("Login with username")}
                                    onPress={() => this.setState({action: 'login'})} color={'rgb(60, 167, 60)'}/>
                        </View>
                        }
                        {this.state.action === 'login' &&
                        <View style={{width: '100%', padding: 15}}>
                            <Text style={{fontSize: 25, fontWeight: "bold"}}>{I18n.get('Login')}</Text>

                            <FormField
                                theme={theme}
                                testID={'username'}
                                onChangeText={text => this.setState({username: text})}
                                label={I18n.get('Enter your username')}
                                placeholder={I18n.get('Enter your username')}
                                required={true}
                            />

                            <FormField
                                theme={theme}
                                testID={'password'}
                                onChangeText={text => this.setState({password: text})}
                                label={I18n.get('Password')}
                                placeholder={I18n.get('Enter your password')}
                                secureTextEntry={true}
                                required={true}
                            />

                            <LinkCell onPress={() => this.changeState('forgotPassword', this.state.username)}>{I18n.get('Forgot password?')}</LinkCell>

                            <View style={{marginTop: 15}}>
                                <Button title={I18n.get("Login")} testID={'login'} color={'rgb(60, 167, 60)'}
                                        onPress={() => this.signIn()} disabled={this.state.signingIn}/>
                            </View>


                        </View>
                        }
                        {this.state.action !== 'choose' &&
                        <LinkCell onPress={() => this.setState({action: 'choose'})}>{I18n.get('Back')}</LinkCell>}
                    </View>
                    <ErrorRow>{this.state.error}</ErrorRow>
                </ScrollView>
                {this.state.action === 'choose' &&
                    <Text onPress={() => {Linking.openURL("https://www.openecmr.com/?utm_source=app&utm_content=login")}}
                          style={{textAlign: "center", textDecorationLine: "underline", color: "blue", bottom: 50, padding: 10, position: "absolute", fontSize: 20}}>{I18n.get('Find more information on Open e-CMR at www.openecmr.com')}</Text>}

            </View>

        )
    }

    googleLogin() {
        Auth.federatedSignIn({provider:'google'});
    }

    changeState(state, data) {
        if (this.props.onStateChange) {
            this.props.onStateChange(state, data);
        }
    }

    signIn() {

        this.setState({
            signingIn: true
        });
        const {username, password} = this.state;

        if (!username || !password) {
            this.setState({
                signingIn: false
            });
            Alert.alert(
                I18n.get('Required fields'),
                I18n.get('Please enter username and password'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            return;
        }

        Auth.signIn(username.trim(), password.trim())
            .then(user => {
                logger.debug(user);
                const requireMFA = user.Session !== null;
                if (user.challengeName === 'SMS_MFA') {
                    this.changeState('confirmSignIn', user);
                } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    logger.debug('require new password', user.challengeParam);
                    this.changeState('requireNewPassword', user);
                } else {
                    this.checkContact(user);
                }
            })
            .catch(err => {
                this.setState({
                    signingIn: false
                });
                this.error(err);
            });
    }

    checkContact(user) {
        Auth.verifiedContact(user).then(data => {
            logger.debug('verified user attributes', data);
            if (!JS.isEmpty(data.verified)) {
                this.changeState('signedIn', user);
            } else {
                user = Object.assign(user, data);
                this.changeState('verifyContact', user);
            }
        });
    }

    error(err) {
        logger.debug(err);

        let msg = '';
        if (typeof err === 'string') {
            msg = err;
        } else if (err.message) {
            msg = err.message;
        } else {
            msg = JSON.stringify(err);
        }

        const map = this.props.errorMessage || this.props.messageMap || AmplifyMessageMap;
        msg = typeof map === 'string' ? map : map(msg);
        Alert.alert(
            I18n.get('Failed login'),
            msg,
            [
                {text: I18n.get('OK')}
            ],
            {cancelable: true}
        );
    }
}

I18n.get('Confirm a Code');
I18n.get('Sign In');
I18n.get('Email');
I18n.get('Phone Number');
I18n.get('Sign Up')
I18n.get('Username');
I18n.get('Invalid password format');
I18n.get('Invalid email address format');
I18n.get('Resend code');
I18n.get('Back to Sign In');
I18n.get('Confirmation Code');
I18n.get('Enter your confirmation code');
I18n.get('Please Sign In / Sign Up');
I18n.get('Create a new account');
I18n.get('Reset your password');
I18n.get('Send');