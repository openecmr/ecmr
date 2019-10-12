import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';
import Transports from "./Transports";
import Transport from "./Transport";
import ConfirmLoading from "./ConfirmLoading";
import SignSelection from "./SignSelection";
import Signature from "./Signature";
import CaptureSignature from "./CaptureSignature";
import SettingsScreen from "./SettingsScreen";

Amplify.configure(awsmobile);
Amplify.Logger.LOG_LEVEL = 'DEBUG';

const MainNavigator = createStackNavigator({
    Transports: {screen: Transports},
    Transport: {screen: Transport},
    ConfirmLoading: {screen: ConfirmLoading},
    SignSelection: {screen: SignSelection},
    Signature: {screen: Signature},
    CaptureSignature: {screen: CaptureSignature}
});

const TabNavigator = createBottomTabNavigator({
    Home: MainNavigator,
    Settings: withAuthenticator(SettingsScreen)
});


const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null;
const App = createAppContainer(TabNavigator);
const AppWithPersistence = () => <App persistenceKey={navigationPersistenceKey}/>;

export default withAuthenticator(AppWithPersistence);