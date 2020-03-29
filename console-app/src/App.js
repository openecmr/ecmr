import React, {Component, useState} from 'react';
import './App.css';
import {Menu, Image, Icon, Header, Modal, Form, Button, Sidebar} from "semantic-ui-react";
import Transports from "./Transports";
import {BrowserRouter as Router, Route, Link, withRouter, Redirect, Switch} from "react-router-dom";
import {NewTransport} from "./NewTransport";

import Amplify, {API, graphqlOperation} from 'aws-amplify';
import { Auth, Hub, I18n } from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import Transport from "./Transport";
import style from "./Style"
import AddressBook from "./AddressBook";
import Drivers from "./Drivers";
import TransportPdf from "./TransportPdf";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import Vehicles from "./Vehicles";
import * as ConsoleUtils from "./ConsoleUtils"

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
            <Header icon={"building"} content={"Please enter your company details"}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input onChange={this.handleChange} label='Company name' type='input' name={"name"} value={this.state.name}
                                placeholder={"International Transporting Corp..."}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='green' inverted onClick={this.save}>
                    <Icon name='checkmark'/> {'Save'}
                </Button>
            </Modal.Actions>
        </Modal>
    }
}

const AppMenu = withRouter(({location, onLogout}) => (
    <Menu vertical fixed={'left'} style={style.appMenu}>
        {console.log(location)}
        <Menu.Item
            name='my transports'
            to={'/transports'}
            active={location.pathname.startsWith('/transports')}
            as={Link}
        />
        <Menu.Item
            name='Address book'
            active={location.pathname.startsWith('/addressbook')}
            to={'/addressbook'}
            as={Link}
        />
        <Menu.Item
            name='drivers'
            active={location.pathname.startsWith('/drivers')}
            to={'/drivers'}
            as={Link}
        />
        <Menu.Item
            name='vehicles'
            active={location.pathname.startsWith('/vehicles')}
            to={'/vehicles'}
            as={Link}
        />
    </Menu>));


const Main = withRouter(({location, onLogout, user, company, noCompany, onCompanyUpdated}) => {
    const [visible, setVisible] = useState(true);
    const pdf = location.pathname.endsWith('/pdf');

    return (<div>
            {pdf && <Route exact path="/transports/:id/pdf" component={TransportPdf}/>}
            {!pdf &&
            <div>
                <Menu fixed='top' inverted>
                    <Menu.Item as='a' header onClick={() => setVisible(!visible)}>
                        <Image size='mini' src='/logo.png' style={{marginRight: '1.5em'}}/>
                        Open e-CMR
                    </Menu.Item>
                    <Menu.Item header position={"right"}>
                        <Icon name={'user'}/>
                        {company && company.name}
                        {user && ` (${user.attributes['email']})`}
                    </Menu.Item>
                    <Menu.Item name={'logout'} header onClick={onLogout}/>
                </Menu>
                <CompanyDialog show={noCompany} onCompanyUpdated={onCompanyUpdated}/>

                <Sidebar.Pushable>
                    <Sidebar animation={"overlay"} visible={visible} as={Menu} vertical style={style.appMenu}>

                        <Menu.Item
                            name='my transports'
                            to={'/transports'}
                            active={location.pathname.startsWith('/transports')}
                            as={Link}
                        />
                        <Menu.Item
                            name='Address book'
                            active={location.pathname.startsWith('/addressbook')}
                            to={'/addressbook'}
                            as={Link}
                        />
                        <Menu.Item
                            name='drivers'
                            active={location.pathname.startsWith('/drivers')}
                            to={'/drivers'}
                            as={Link}
                        />
                        <Menu.Item
                            name='vehicles'
                            active={location.pathname.startsWith('/vehicles')}
                            to={'/vehicles'}
                            as={Link}
                        />
                    </Sidebar>
                    <Sidebar.Pusher>
                        <div style={style.content}>
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
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
            }
        </div>);
});

const signUpConfig = {
    header: 'Sign up for Open e-CMR',
    hideAllDefaults: true,
    defaultCountryCode: '1',
    signUpFields: [
        {
            label: 'Email address',
            key: 'email',
            required: true,
            displayOrder: 1,
            type: 'string'
        },
        {
            label: 'Username',
            key: 'username',
            required: true,
            displayOrder: 2,
            type: 'string'
        },
        {
            label: 'Password',
            key: 'password',
            required: true,
            displayOrder: 3,
            type: 'password'
        }
    ]
};

const MainWithAuth = pdfServiceKey ?  Main : withAuthenticator(Main, {
    signUpConfig
});

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
    }

    render() {
        return (
            <Router>
                <MainWithAuth onLogout={() => this.logout()} user={this.state.user}
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
            this.setState({
                user: await Auth.currentAuthenticatedUser()
            });

            this.checkCompany();
        } catch (ex) {
        }
    }

    async checkCompany() {
        const response = await API.graphql(graphqlOperation(queries.listCompanys, {
            "filter": {
                "owner": {
                    "eq": this.state.user.username
                }
            },
            "limit": 1000
        }));

        if (response.data.listCompanys.items.length > 0) {
            this.setState({
                company: response.data.listCompanys.items[0],
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


const authScreenLabels = {
    en: {
        'Sign in to your account': 'Sign in to your Open e-CMR account',
        'Sign in with AWS': 'Sign in / Sign up using Google'
    }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

export default App;