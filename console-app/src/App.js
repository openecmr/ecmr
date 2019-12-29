import React, { Component } from 'react';
import './App.css';
import {Container, Grid, Header, Menu, Dropdown, Image} from "semantic-ui-react";
import Transports from "./Transports";
import {BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom";
import NewTransport from "./NewTransport";

import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import Transport from "./Transport";
import style from "./Style"
import AddressBook from "./AddressBook";
import Drivers from "./Drivers";
import TransportPdf from "./TransportPdf";

let config;
const pdfServiceKey = window.location.hash.substr(1);
if (pdfServiceKey) {
    config = {
        ...awsmobile,
        'aws_appsync_authenticationType': 'API_KEY',
        'aws_appsync_apiKey': pdfServiceKey,
    };
    window.location.hash = '#';
} else {
    config = awsmobile;
}

Amplify.configure(config);

const AppMenu = withRouter(({location}) => (
    <Menu vertical fixed={'left'} style={style.appMenu}>
        {console.log(location)}
        <Menu.Item
            name='transports'
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
            name='settings'
            active={location.pathname.startsWith('/settings')}
            to={'/settings'}
            as={Link}
        />
        <Menu.Item
            name='drivers'
            active={location.pathname.startsWith('/drivers')}
            to={'/drivers'}
            as={Link}
        />
    </Menu>));

const Main = withRouter(({location}) => {
    const pdf = location.pathname.endsWith('/pdf');

    return (<div>
            {pdf && <Route exact path="/transports/:id/pdf" component={TransportPdf}/>}
            {!pdf &&
            <div>
                <Menu fixed='top' inverted>
                    <Menu.Item as='a' header>
                        <Image size='mini' src='/logo.png' style={{marginRight: '1.5em'}}/>
                        Open e-CMR
                    </Menu.Item>
                </Menu>

                <AppMenu/>

                <div style={style.content}>
                    <Route exact path="/transports" component={Transports}/>
                    <Route exact path="/transports-new/:copy_id" component={NewTransport}/>
                    <Route exact path="/transports-new" component={NewTransport}/>
                    <Route exact path="/transports/:id" component={Transport}/>
                    <Route exact path="/addressbook" component={AddressBook}/>
                    <Route exact path="/drivers" component={Drivers}/>
                </div>
            </div>
            }
        </div>);
});

class App extends Component {
    render() {
        return (
            <Router>
                <Main/>
            </Router>
        );
    }
}
export default pdfServiceKey ?  App : withAuthenticator(App, false);