import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Transports from "./Transports";
import Transport from "./Transport";

Amplify.configure(awsmobile);


const MainNavigator = createStackNavigator({
    Transports: {screen: Transports},
    Transport: {screen: Transport}
});

const App = createAppContainer(MainNavigator);

export default withAuthenticator(App, true);