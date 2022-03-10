import { createStackNavigator } from '@react-navigation/stack';
import React, {useRef} from 'react';
import Amplify, {I18n} from 'aws-amplify';
import awsmobile from './aws-exports';
import { LogBox } from 'react-native';
import {Authenticator, ConfirmSignUp, SignUp, withAuthenticator} from 'aws-amplify-react-native';
import Transports from "./Transports";
import Transport from "./Transport";
import ConfirmLoading from "./ConfirmLoading";
import SignSelection from "./SignSelection";
import Signature from "./Signature";
import CaptureSignature from "./CaptureSignature";
import SettingsScreen from "./SettingsScreen";
import LinkAccount from "./LinkAccount";
import SignatoryInformation from "./SignatoryInformation";
import AmplifyTheme from "aws-amplify-react-native/dist/AmplifyTheme";
import EcmrSignIn from "./EcmrSignIn";
import ConfirmSignIn from "aws-amplify-react-native/dist/Auth/ConfirmSignIn";
import VerifyContact from "aws-amplify-react-native/dist/Auth/VerifyContact";
import ForgotPassword from "aws-amplify-react-native/dist/Auth/ForgotPassword";
import RequireNewPassword from "aws-amplify-react-native/dist/Auth/RequireNewPassword";
import {Icon} from "react-native-elements";
import AddPhotos from "./AddPhotos";
import i18nDictionaryNl from './i18n/nl/resource';
import {Platform, NativeModules, Text} from 'react-native';
import moment from 'moment/min/moment-with-locales';
import SelectSignatory from "./SelectSignatory";
import AddContact from "./AddContact";
import EcmrLoading from "./EcmrLoading";
import AddTransportScreen from "./AddTransportScreen";
import SelectAddress from "./SelectAddress";
import SelectVehicle from "./SelectVehicle";
import AddLoad from "./AddLoad";
import NewTransportSelection from "./NewTransportSelection";
import SelectCompany from "./SelectCompany";
import Bugsnag from '@bugsnag/react-native'
import analytics from '@react-native-firebase/analytics';
import AddAddress from "./AddAddress";
import AddVehicle from "./AddVehicle";
import {NavigationContainer, useNavigationContainerRef} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const vocabularies = {
    nl: i18nDictionaryNl
};

const language = deviceLanguage.split("_")[0];
I18n.setLanguage(language);
I18n.putVocabularies(vocabularies);
moment.locale(language);

const config = {
    ...awsmobile,
    Analytics: {
        disabled: true,
    }
};
config['oauth']['domain'] = "auth.openecmr.com";
Amplify.configure(config);
Amplify.Logger.LOG_LEVEL = 'DEBUG';

Bugsnag.start()

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const Stack = createStackNavigator();

const MainNavigator = () => <Stack.Navigator screenOptions={{
    cardStyle: {
        backgroundColor: 'rgb(245,245,245)'
    }
}}>
    <Stack.Screen name={"Main"} component={TabNavigator} options={{headerShown: false}} />
    <Stack.Screen name={"Transport"} component={Transport}/>
    <Stack.Screen name={"ConfirmLoading"} component={ConfirmLoading} options={{title: I18n.get('Check loads')}}/>
    <Stack.Screen name={"AddLoadConfirm"} component={AddLoad}/>
    <Stack.Screen name={"SignSelection"} component={SignSelection} options={{title: I18n.get('Select signing method')}}/>
    <Stack.Screen name={"Signature"} component={Signature} options={{title: I18n.get('Check information')}}/>
    <Stack.Screen name={"CaptureSignature"} component={CaptureSignature} options={{title: I18n.get('Draw signature')}}/>
    <Stack.Screen name={"SignatoryInformation"} component={SignatoryInformation} options={{title: I18n.get('Signatory information')}}/>
    <Stack.Screen name={"AddPhotos"} component={AddPhotos} options={{title: I18n.get('Add photos?')}}/>
    <Stack.Screen name={"SelectSignatory"} component={SelectSignatory}/>
    <Stack.Screen name={"AddContact"} component={AddContact} options={{title: I18n.get('Add contact')}}/>

    <Stack.Screen name={"AddTransportScreen"} component={AddTransportScreen}
                  options={{title: I18n.get("New transport")}}/>
    <Stack.Screen name={"SelectAddress"} component={SelectAddress}/>
    <Stack.Screen name={"AddAddress"} component={AddAddress}/>
    <Stack.Screen name={"AddVehicle"} component={AddVehicle}/>
    <Stack.Screen name={"SelectVehicle"} component={SelectVehicle}/>
    <Stack.Screen name={"AddLoad"} component={AddLoad}/>
    <Stack.Screen name={"SelectCompany"} component={SelectCompany}
                  options={{title: I18n.get("Select submitter company")}} />

    <Stack.Screen name={"LinkAccount"} component={LinkAccount} options={{title: I18n.get('Link account')}}/>
</Stack.Navigator>


const Tab = createBottomTabNavigator();

const TabNavigator = () => <Tab.Navigator screenOptions={{
    tabBarOptions: {
        style: {
            elevation: 15
        }
    },
    headerShown: false
}}>
    <Tab.Screen name="Home" component={Transports} options={{
        tabBarIcon: () => {
            return <Icon name={"local-shipping"}/>
        },
        tabBarLabel: I18n.get("Transports")
    }} />
    <Tab.Screen name="AddTransport" component={NewTransportSelection} options={{
        tabBarIcon: () => {
            return <Icon name={"add"}/>
        },
        tabBarLabel: I18n.get("New transport")
    }} />
    <Tab.Screen name="Settings" component={withAuthenticator(SettingsScreen)} options={{
        tabBarIcon: () => {
            return <Icon name="settings"/>
        },
        tabBarLabel: I18n.get("Settings")
    }} />
</Tab.Navigator>


const App = (props) => {
    const navigationRef = useNavigationContainerRef();
    const routeNameRef = useRef();

    return <NavigationContainer
        {...props}
        ref={navigationRef}
        onReady={() => {
            routeNameRef.current = navigationRef.getCurrentRoute().name;
        }}
        onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
                await analytics().logScreenView({
                    screen_name: currentRouteName,
                    screen_class: currentRouteName
                });
            }
            routeNameRef.current = currentRouteName;
        }}>
        <MainNavigator/>
    </NavigationContainer>;
}


const AppWithPersistence = () => <App />

const MySectionHeader = Object.assign({}, AmplifyTheme.button, { backgroundColor: 'rgb(60,176,60)' });
const MyTheme = Object.assign({}, AmplifyTheme, {button: MySectionHeader});

export default withAuthenticator(AppWithPersistence, false, [
    <EcmrSignIn override={'SignIn'}/>,
    <EcmrLoading />,
    <SignUp />,
    <ConfirmSignIn />,
    <VerifyContact />,
    <ConfirmSignUp />,
    <ForgotPassword />,
    <RequireNewPassword />
], null, MyTheme);