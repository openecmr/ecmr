import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import { createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import Transports from "./Transports";
import Transport from "./Transport";
import ConfirmLoading from "./ConfirmLoading";
import SignSelection from "./SignSelection";
import Signature from "./Signature";
import CaptureSignature from "./CaptureSignature";
import SettingsScreen from "./SettingsScreen";
import LinkAccount from "./LinkAccount";
import SignatoryInformation from "./SignatoryInformation";
import {createBottomTabNavigator} from "react-navigation-tabs";

Amplify.configure(awsmobile);
Amplify.Logger.LOG_LEVEL = 'DEBUG';

const MainNavigator = createStackNavigator({
    Transports: {screen: Transports},
    Transport: {screen: Transport},
    ConfirmLoading: {screen: ConfirmLoading},
    SignSelection: {screen: SignSelection},
    Signature: {screen: Signature},
    CaptureSignature: {screen: CaptureSignature},
    SignatoryInformation: {screen: SignatoryInformation}
});

const SettingsNavigator = createStackNavigator({
    SettingsScreen: {screen: withAuthenticator(SettingsScreen)},
    LinkAccount: {screen: LinkAccount}
});

const TabNavigator = createBottomTabNavigator({
    Home: MainNavigator,
    Settings: SettingsNavigator
});


const App = createAppContainer(TabNavigator);
const AppWithPersistence = () => <App/>;

export default withAuthenticator(AppWithPersistence);