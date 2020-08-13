import React, {Component, useEffect, useState} from 'react';
import './App.css';
import {Menu, Image, Icon, Header, Modal, Form, Button} from "semantic-ui-react";
import Transports from "./Transports";
import {BrowserRouter as Router, Route, Link, withRouter, Redirect, Switch} from "react-router-dom";
import {NewTransport} from "./NewTransport";

import Amplify, {API, graphqlOperation} from 'aws-amplify';
import { Auth, Hub, I18n } from 'aws-amplify';
import awsmobile from './aws-exports';
import {
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

const AppMenu = withRouter(({location, onLogout, menuVisible}) => (
    <Menu vertical fixed={'left'} style={{...style.appMenu, display: menuVisible ? "block" : "none"}}>
        <Menu.Item
            name={I18n.get('my transports')}
            to={'/transports'}
            active={location.pathname.startsWith('/transports')}
            as={Link}
        />
        <Menu.Item
            name={I18n.get('Address book')}
            active={location.pathname.startsWith('/addressbook')}
            to={'/addressbook'}
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
    </Menu>));

const Main = withRouter(({location, onLogout, user, company, noCompany, onCompanyUpdated, history}) => {
    ReactGA.pageview(location.pathname);
    const pdf = location.pathname.endsWith('/pdf');
    const [menuVisible, setMenuVisible] = useState(true);

    return (<div>
            {pdf && <Route exact path="/transports/:id/pdf" component={TransportPdf}/>}
            {!pdf &&
            <div>
                <Menu fixed='top' inverted>
                    <Menu.Item as='a' header onClick={() => setMenuVisible(!menuVisible)}>
                        <Image size='mini' src='/logo.png' style={{marginRight: '1.5em'}}/>
                        Open e-CMR
                    </Menu.Item>
                    <Menu.Item header position={"right"}>
                        <Icon name={'user'}/>
                        {company && company.name}
                        {user && ` (${user.attributes['email']})`}
                    </Menu.Item>
                    <Menu.Item name={I18n.get('logout')} header onClick={onLogout}/>
                </Menu>

                <AppMenu onLogout={onLogout} menuVisible={menuVisible}/>

                <CompanyDialog show={noCompany} onCompanyUpdated={onCompanyUpdated}/>

                <div style={{...style.content, ...(!menuVisible && {marginLeft: "0"})}}>
                    <Switch>
                        <Route exact path="/transports" component={Transports}/>
                        <Route exact path="/transports-new/:copy_id"
                               render={(props) => <NewTransport {...props} company={company}/>}
                        />
                        <Route exact path="/transports-new"
                               render={(props) => <NewTransport {...props} company={company}/>}
                        />
                        <Route exact path="/transports/:id" component={Transport}/>
                        <Route exact path="/addressbook" component={AddressBook}/>
                        <Route exact path="/drivers" component={Drivers}/>
                        <Route exact path="/vehicles"
                               render={(props) => <Vehicles {...props} company={company}/>}/>
                        <Redirect exact from="/" to="/transports" />
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

const MainWithAuth = pdfServiceKey ?  Main : withAuthenticator(Main, false,
    [
        <SignUpWithLanguage hide={false} override={'SignUp'} signUpConfig={signUpConfig} />,
        <SignIn  />,
        <Loading />,
        <ConfirmSignIn />,
        <VerifyContact />,
        <ConfirmSignUp />,
        <ForgotPassword />,
        <RequireNewPassword />
    ],
    {
    signUpConfig
});

const MyContainer = ({children}) =>
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <Image size='tiny' src='/logo.png' style={{marginTop: 20}} avatar />
        <Container>{children}</Container>
    </div>;

class App extends Component {
    state = {
        user: null,
        company: null,
        noCompany: false
    };
    constructor(props) {
        super(props);

        Hub.listen('auth', (data) => {
            this.componentDidMount();
        })

        this.checkCompany = this.checkCompany.bind(this);

        ReactGA.initialize('UA-160827083-1', {
            titleCase: false
        });
    }

    render() {

        return (
            <Router>
                <MainWithAuth container={MyContainer}
                              onLogout={() => this.logout()} user={this.state.user}
                              company={this.state.company}
                              onCompanyUpdated={this.checkCompany}
                              noCompany={this.state.noCompany}/>
            </Router>
        );
    }

    async logout() {
        await Auth.signOut()
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
}

// allow these strings to be picked up by the i18n extraction
// FIXME find some other way
I18n.get('Sign in to your account');
I18n.get('Sign in with AWS');
I18n.get('Enter your username')
I18n.get('Enter your password')
I18n.get('Reset password')
I18n.get('Sign In')
I18n.get('No account? ')
I18n.get('Create account')
I18n.get('Forget your password? ')
I18n.get('or')
I18n.get('Incorrect username or password')
I18n.get('Have an account? ')
I18n.get('Sign in')
I18n.get('Create Account')
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