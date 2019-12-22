import React, {Component} from "react";
import {
    SectionList,
    StyleSheet,
    Text,
    Button,
    TouchableOpacity,
    View,
    Dimensions,
    Image,
    ScrollView
} from "react-native";
import * as queries from "./graphql/queries";
import {API, Auth, graphqlOperation, I18n, Logger} from 'aws-amplify';
import {Address, MyText, Packages} from './Components';
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import ContractModel from "./ContractModel";
import {Input} from "react-native-elements";
import {FormField} from "aws-amplify-react-native";
import AmplifyTheme from "aws-amplify-react-native/dist/AmplifyTheme";

const logger = new Logger('EcmrSignIn');

export default class EcmrSignIn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            action: 'choose'
        };

    }

    render() {
        if (this.props.authState !== 'signIn') {
            return null;
        }

        const theme = AmplifyTheme;

        return (

            <View style={{flex: 1, width: '100%', alignItems: 'center', backgroundColor: 'white'}}>
                    <ScrollView style={{flex: 1, width: '100%'}} >
                    <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
                        <View>
                            <Image style={{marginLeft: 50, width: 50, height: 50}}
                                   source={require('./images/logo.png')}/>
                            <Text style={{fontSize: 30, fontWeight: "bold"}}>Open e-CMR</Text>
                        </View>
                        {this.state.action === 'choose' &&
                        <View style={{marginTop: 50, width: '100%', padding: 15}}>
                            <Button containerStyle={{marginBottom: 50}} title={"Login with username"}
                                    onPress={() => this.setState({action: 'login'})} color={'rgb(60, 167, 60)'}/>
                            <Text style={{
                                marginTop: 10, marginBottom: 10, textAlign: "center", fontWeight: "bold",
                                borderBottomColor: "black",
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderColor: "black",
                                borderTopWidth: StyleSheet.hairlineWidth
                            }}>or</Text>
                            <Button title={"Create an account"} color={'rgb(60, 167, 60)'} onPress={() => this.changeState("signUp")}/>
                        </View>
                        }
                        {this.state.action === 'login' &&
                        <View style={{width: '100%', padding: 15}}>
                            <Text style={{fontSize: 25, fontWeight: "bold"}}>Login</Text>
                            <Text style={{marginBottom: 10}}>using your username</Text>

                            <FormField
                                theme={theme}
                                onChangeText={text => this.setState({username: text})}
                                label={I18n.get('Enter your username')}
                                placeholder={I18n.get('Enter your username')}
                                required={true}
                            />

                            <FormField
                                theme={theme}
                                onChangeText={text => this.setState({password: text})}
                                label={I18n.get('Password')}
                                placeholder={I18n.get('Enter your password')}
                                secureTextEntry={true}
                                required={true}
                            />

                            <View style={{marginTop: 15}}>
                                <Button title={"Login"} color={'rgb(60, 167, 60)'}
                                        onPress={() => this.signIn()}/>
                            </View>
                        </View>
                        }
                    </View>
                    </ScrollView>

            </View>

        )
    }

    changeState(state, data) {
        if (this.props.onStateChange) {
            this.props.onStateChange(state, data);
        }
    }

    signIn() {
        const {username, password} = this.state;
        logger.debug('Sign In for ' + username);
        Auth.signIn(username, password)
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
            .catch(err => this.error(err));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionHeader: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        color: 'black'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    card: {
        backgroundColor: 'white',
        elevation: 5,
        marginBottom: 10
    },
    transportCardHeader: {
        flexDirection: 'row',
        backgroundColor: 'rgb(225,236,254)',
        paddingTop: 10,
        paddingBottom: 10
    },
    transportCardHeaderId: {
        flex: 2,
        fontWeight: 'bold',
        paddingRight: 5,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    transportCardHeaderProgress: {
        flex: 1,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        right: 10,
        borderRadius: 15,
        backgroundColor: 'rgb(60, 167, 60)',

        paddingRight: 5,
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    transportCardPart: {
        flex: 1,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 1,
        backgroundColor: 'white'
    },
    upperCaseLabel: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
});