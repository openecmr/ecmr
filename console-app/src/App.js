import React, {Component, useEffect, useState} from 'react';
import './App.css';
import {Dropdown, Menu, Image, Icon, Header, Modal, Form, Button, Popup} from "semantic-ui-react";
import Transports from "./Transports";
import {BrowserRouter as Router, Route, Link, withRouter, Redirect, Switch} from "react-router-dom";
import {NewTransport} from "./NewTransport";

import Amplify, {API, graphqlOperation} from 'aws-amplify';
import { Auth, Hub, I18n } from 'aws-amplify';
import awsmobile from './aws-exports';
import {
    Greetings,
    ConfirmSignIn,
    ConfirmSignUp,
    Container, ForgotPassword,
    Loading, RequireNewPassword, SignIn,
    SignUp,
    VerifyContact,
    withAuthenticator
} from 'aws-amplify-react';
import Transport from "./Transport";
import style from "./Style"
import AddressBook from "./AddressBook";
import Drivers from "./Drivers";
import TransportPdf from "./TransportPdf";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import Vehicles from "./Vehicles";
import * as ConsoleUtils from "./ConsoleUtils"
import ReactGA from 'react-ga';
import i18nDictionaryNl from './i18n/nl/resource';
import moment from 'moment/min/moment-with-locales';
import SignUpWithLanguage from "./SignUpWithLanguage";
import Contacts from "./Contacts";
import '@aws-amplify/ui/dist/style.css';
import Settings from "./Settings";
import Planner from "./Planner";
import Orders from "./Orders";

let config;
const pdfServiceKey = window.location.hash.substr(1);
if (pdfServiceKey) {
    config = {
        ...awsmobile,
        'aws_appsync_authenticationType': 'API_KEY',
        'aws_appsync_apiKey': pdfServiceKey,
    };
    // delete config["oauth"];
    window.location.hash = '#';
} else {
    config = awsmobile;
    config['oauth']['domain'] = "auth.openecmr.com";
}

Amplify.configure(config);

window.onunhandledrejection = (err) => {
    console.error(err);
    if (err.reason.errors) {
        ReactGA.exception({
            description: err.reason.errors[0].message,
            fatal: false
        });
    } else {
        ReactGA.exception({
            description: err,
            fatal: false
        });
    }
}

class CompanyDialog extends Component {
    state = {
        name: ''
    };

    constructor(props) {
        super(props);

        this.save = this.save.bind(this);
    }

    handleChange = (e, {name, value}) => {
        this.setState({
            name: value
        });
    };

    async save() {
        if (this.state.saving) {
            return;
        }
        this.setState({
            saving: true
        });

        const username = (await Auth.currentAuthenticatedUser()).getUsername();
        const companyResult = await API.graphql(graphqlOperation(mutations.createCompany, {input: {
            owner: username,
            name: this.state.name
        }}));
        const companyId = companyResult.data.createCompany.id;
        await API.graphql(graphqlOperation(mutations.createContact, {
            input: {
                owner: username,
                name: this.state.name
            }
        }));
        await API.graphql(graphqlOperation(mutations.createDriver, {
            input: {
                owner: username,
                name: this.state.name + " driver",
                carrier: username
            }
        }));
        await API.graphql(graphqlOperation(mutations.createVehicle, {
            input: {
                companyId: companyId,
                owner: username,
                licensePlateNumber: "ab-12-34",
                type: "TRUCK",
                description: this.state.name + " truck"
            }
        }));
        await API.graphql(graphqlOperation(mutations.createVehicle, {
            input: {
                companyId: companyId,
                owner: username,
                licensePlateNumber: "ab-12-35",
                type: "TRAILER",
                description: this.state.name + " trailer"
            }
        }));

        this.props.onCompanyUpdated();
    }

    render() {
        return <Modal open={this.props.show} size='small'>
            <Header icon={"building"} content={I18n.get("Please enter your company details")}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input onChange={this.handleChange} label={I18n.get('Company name')} type='input' name={"name"} value={this.state.name}
                                placeholder={I18n.get("International Transporting Corp...")}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='green' inverted onClick={this.save}>
                    <Icon name='checkmark'/> {I18n.get('Save')}
                </Button>
            </Modal.Actions>
        </Modal>
    }
}

const AppMenuCustomerPortal = withRouter(({location, menuVisible}) => (
    <Menu vertical fixed={'left'} style={{...style.appMenu, display: menuVisible ? "block" : "none"}}>
        <Menu.Item
            name={I18n.get('Sent orders')}
            to={'/portal/sent-orders'}
            active={location.pathname.startsWith('/portal/sent-orders') || location.pathname.startsWith('/portal/orders')}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('Address book')}
            active={location.pathname.startsWith('/portal/addressbook')}
            to={'/portal/addressbook'}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('Contacts')}
            active={location.pathname.startsWith('/portal/contacts')}
            to={'/portal/contacts'}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('settings')}
            active={location.pathname.startsWith('/portal/settings')}
            to={'/portal/settings'}
            as={Link}
        />
    </Menu>));

const AppMenu = withRouter(({location, menuVisible}) => (
    <Menu vertical fixed={'left'} style={{...style.appMenu, display: menuVisible ? "block" : "none"}}>
        <Menu.Item
            name={I18n.get('my transports')}
            to={'/transports'}
            active={location.pathname.startsWith('/transports')}
            as={Link}
        />
        {/*<Menu.Item*/}
        {/*    name={I18n.get('Received orders')}*/}
        {/*    to={'/received-orders'}*/}
        {/*    active={location.pathname.startsWith('/received-orders') || location.pathname.startsWith('/orders')}*/}
        {/*    as={Link}*/}
        {/*/>*/}
        <Menu.Item
            name={I18n.get('planner')}
            active={location.pathname.startsWith('/planner')}
            to={'/planner'}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('Address book')}
            active={location.pathname.startsWith('/addressbook')}
            to={'/addressbook'}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('Contacts')}
            active={location.pathname.startsWith('/contacts')}
            to={'/contacts'}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('drivers')}
            active={location.pathname.startsWith('/drivers')}
            to={'/drivers'}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('vehicles')}
            active={location.pathname.startsWith('/vehicles')}
            to={'/vehicles'}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('settings')}
            active={location.pathname.startsWith('/settings')}
            to={'/settings'}
            as={Link}
        />
    </Menu>));

const Main = withRouter(({location, onLogout, user, company, noCompany, onCompanyUpdated, history, customerPortal}) => {
    ReactGA.pageview(location.pathname);
    const pdf = location.pathname.endsWith('/pdf');
    const [menuVisible, setMenuVisible] = useState(true);
    const [language, setLanguage] = useState();
    const [transportState, setTransportState] = useState({});

    async function changeLanguage(language) {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, {
            "custom:language": language
        });
        window.location.reload();
    }

    useEffect(() => {
        async function getLanguage() {
            const currentUserInfo = await Auth.currentUserInfo()
            if (currentUserInfo) {
                const userLanguage = currentUserInfo.attributes['custom:language'];
                if (userLanguage) {
                    I18n.setLanguage(userLanguage);
                    setLanguage(userLanguage);
                }
            }
        }

        getLanguage();
    }, []);

    const routerPrefix = customerPortal ? "/portal" : "";

    return (<div>
        {pdf && <Route exact path="/transports/:id/pdf" component={TransportPdf}/>}
        {!pdf &&
        <div lang={language}>
            <Menu fixed='top' inverted>
                <Menu.Item as='a' header onClick={() => setMenuVisible(!menuVisible)}>
                    <Image size='mini' src='/logo.png' style={{marginRight: '1.5em'}}/>
                    {customerPortal ? I18n.get("{companyName} customer portal").replace("{companyName}", customerPortal.carrierName) : "Open e-CMR"}
                </Menu.Item>
                <Popup hoverable position={"bottom center"} size={"huge"} wide trigger={
                    <Menu.Item header position={"right"}>
                        <Icon name={'user'}/>
                        {company && company.name}
                        {user && ` (${user.attributes['email']})`}
                        <Icon name={"angle down"}/>
                    </Menu.Item>
                }>

                    <Menu secondary vertical>
                        <Dropdown item text={I18n.get("Language")} direction={"left"}>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => changeLanguage("en")}>English</Dropdown.Item>
                                <Dropdown.Item onClick={() => changeLanguage("nl")}>Nederlands</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Menu.Item as={'a'} onClick={onLogout}>
                            {I18n.get('Logout')}
                        </Menu.Item>
                    </Menu>
                </Popup>
            </Menu>

            {!customerPortal && <AppMenu onLogout={onLogout} menuVisible={menuVisible}/>}
            {customerPortal && <AppMenuCustomerPortal onLogout={onLogout} menuVisible={menuVisible}/>}

            <CompanyDialog show={noCompany} onCompanyUpdated={onCompanyUpdated}/>

            <div style={{...style.content, ...(!menuVisible && {marginLeft: "0"})}}>
                <Switch>
                    <Route exact path="/transports" render={(props) =>
                        <Transports setParentState={(s) => setTransportState(s)} {...props} {...transportState} />}/>
                    <Route exact path="/transports-new/:copy_id"
                           render={(props) => <NewTransport {...props} company={company}/>}
                    />
                    <Route exact path="/transports-new"
                           render={(props) => <NewTransport {...props} company={company}/>}
                    />
                    <Route exact path="/orders-new"
                           render={(props) => <NewTransport {...props} company={company} portal={customerPortal}
                                                            order={true}/>}
                    />
                    <Route exact path={`${routerPrefix}/sent-orders`}
                           render={(props) => <Orders key={"sent"} {...props} direction={"sent"}
                                                      routerPrefix={routerPrefix}/>}/>
                    <Route exact path="/received-orders"
                           render={(props) => <Orders key={"received"} {...props} direction={"received"}/>}/>
                    <Route exact path="/transports/:id" component={(props) => <Transport {...props} company={company}/>}/>

                    <Route exact path="/transports/edit/:edit_id"
                           render={(props) => <NewTransport {...props} company={company}/>}
                    />

                    <Route exact path={`${routerPrefix}/orders/:id`}
                           render={(props) => <Transport {...props} viewOrder={true}/>}/>
                    <Route exact path={`${routerPrefix}/addressbook`} component={AddressBook}/>
                    <Route exact path={`${routerPrefix}/contacts`} component={Contacts}/>
                    <Route exact path="/drivers" component={Drivers}/>
                    <Route exact path="/planner" component={Planner}/>
                    <Route exact path="/vehicles"
                           render={(props) => <Vehicles {...props} company={company}/>}/>
                    <Route exact path={`${routerPrefix}/settings`}
                           render={(props) => <Settings {...props} key={company} company={company}
                                                        onCompanyUpdated={onCompanyUpdated}
                                                        customerPortal={customerPortal}/>}/>
                    <Redirect exact from="/" to="/transports"/>
                </Switch>
            </div>
        </div>
        }
    </div>);
});

const signUpConfig = {
    header: I18n.get('Sign up for Open e-CMR'),
    hideAllDefaults: true,
    defaultCountryCode: '1',
    signUpFields: [
        {
            label: I18n.get('Email address'),
            key: 'email',
            required: true,
            displayOrder: 1,
            type: 'string'
        },
        {
            label: I18n.get('Username'),
            key: 'username',
            required: true,
            displayOrder: 2,
            type: 'string'
        },
        {
            label: I18n.get('Password'),
            key: 'password',
            required: true,
            displayOrder: 3,
            type: 'password'
        }
    ]
};

let portal;
if (window.location.pathname.startsWith("/portal")) {
    portal = true;
    if (document.location.search) {
        let params = new URLSearchParams(document.location.search.substring(1));
        const carrierName = params.get("carrierName");
        const carrierOwner = params.get("carrierOwner");
        const companyId = params.get("companyId");

        if (!carrierName || !carrierOwner || !companyId) {
            alert("missing parameters");
        } else {
            window.localStorage.setItem("customerPortal", JSON.stringify({
                carrierName,
                carrierOwner,
                companyId
            }));
        }
    }
}

let MainWithAuth;
if (pdfServiceKey) {
    MainWithAuth = Main;
} else {
    MainWithAuth = withAuthenticator(Main, false,
        [
            <SignUpWithLanguage hide={false} override={'SignUp'} signUpConfig={signUpConfig}/>,
            <SignIn/>,
            <Loading/>,
            <ConfirmSignIn/>,
            <VerifyContact/>,
            <ConfirmSignUp/>,
            <ForgotPassword/>,
            <RequireNewPassword/>
        ],
        {
            signUpConfig
        })
}

const MyContainer = ({company, children, customerPortal}) =>
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        {customerPortal && !company && <div className={"portal-header"}>{I18n.get("Welcome to the customer portal of {portalName}").replace("{portalName}", customerPortal.carrierName)}</div>}
        <Image size='tiny' src='/logo.png' style={{marginTop: 20}} avatar />
        <Container>{children}</Container>
    </div>;

class App extends Component {
    constructor(props) {
        super(props);

        Hub.listen('auth', (data) => {
            this.componentDidMount();
        })

        this.checkCompany = this.checkCompany.bind(this);

        ReactGA.initialize('UA-160827083-1', {
            titleCase: false
        });

        const customerPortal = portal && window.localStorage.getItem("customerPortal") ? JSON.parse(window.localStorage.getItem("customerPortal")) : null;

        this.state = {
            user: null,
            company: null,
            noCompany: false,
            customerPortal
        };
    }

    render() {

        return (
            <Router>
                <MainWithAuth
                    customerPortal={this.state.customerPortal}
                    container={(props) => <MyContainer {...props} company={this.state.company} customerPortal={this.state.customerPortal}/>}
                              onLogout={() => this.logout()} user={this.state.user}
                              company={this.state.company}
                              onCompanyUpdated={this.checkCompany}
                              noCompany={this.state.noCompany}/>
            </Router>
        );
    }

    async logout() {
        await Auth.signOut()
        window.location.reload();
    }

    async componentDidMount() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            this.setState({
                user: user
            });
            ReactGA.set({
                userId: user.attributes['sub']
            });
            this.checkCompany();
        } catch (ex) {
            ReactGA.set({
                userId: null
            });
            ReactGA.pageview("/login");
        }
    }

    async checkCompany() {
        const response = await API.graphql(graphqlOperation(queries.companyByOwner, {
            owner: this.state.user.username,
            "limit": 1
        }));

        if (response.data.companyByOwner.items.length > 0) {
            this.setState({
                company: response.data.companyByOwner.items[0],
                noCompany: false
            });
        } else {
            this.setState({
                company: null,
                noCompany: true
            });
        }
    }

    componentDidCatch(error, errorInfo) {
        console.error("uncaught exception ", error, " error ", errorInfo);
        ReactGA.exception({
            description: error,
            fatal: false
        });
    }
}

// allow these strings to be picked up by the i18n extraction
// FIXME find some other way
I18n.get('Loading...');
I18n.get('Sign In');
I18n.get('Sign In with Amazon');
I18n.get('Sign In with Facebook');
I18n.get('Sign In with Google');
I18n.get('Sign in with AWS');
I18n.get('Sign Up');
I18n.get('Sign Out');
I18n.get('Forgot Password');
I18n.get('Username');
I18n.get('Password');
I18n.get('Change Password');
I18n.get('Change');
I18n.get('New Password');
I18n.get('Email');
I18n.get('Phone Number');
I18n.get('Confirm a Code');
I18n.get('Confirm Sign In');
I18n.get('Confirm Sign Up');
I18n.get('Back to Sign In');
I18n.get('Send');
I18n.get('Send Code');
I18n.get('Confirm');
I18n.get('SMS');
I18n.get('Confirm SMS Code');
I18n.get('Confirm TOTP Code');
I18n.get('Resend a Code');
I18n.get('Submit');
I18n.get('Skip');
I18n.get('Verify');
I18n.get('Verify Contact');
I18n.get('Code');
I18n.get('Confirmation Code');
I18n.get('Account recovery requires verified contact information');
I18n.get('User does not exist');
I18n.get('User already exists');
I18n.get('Incorrect username or password');
I18n.get('Invalid password format');
I18n.get('Invalid phone number format');
I18n.get('Username/client id combination not found.');
I18n.get('Network error');
I18n.get('Sign in to your account');
I18n.get('Forget your password? ');
I18n.get('Reset password');
I18n.get('No account? ');
I18n.get('Create account');
I18n.get('Create Account');
I18n.get('Have an account? ');
I18n.get('Sign in');
I18n.get('Create a new account');
I18n.get('Reset your password');
I18n.get('Enter your username');
I18n.get('Enter your password');
I18n.get('Enter your phone number');
I18n.get('Enter your email');
I18n.get('Enter your code');
I18n.get('Lost your code? ');
I18n.get('Resend Code');
I18n.get('An account with the given email already exists.');
I18n.get('Username cannot be empty');


const vocabularies = {
    en: {
        'Sign in to your account': 'Sign in / sign up to your Open e-CMR account',
        'Sign in with AWS': 'Continue using your Google account'
    },
    nl: i18nDictionaryNl
};

// I18n.setLanguage('nl');
I18n.putVocabularies(vocabularies);
moment.locale(navigator.languages
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage));

export default App;