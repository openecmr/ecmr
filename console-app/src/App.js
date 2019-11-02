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

Amplify.configure(awsmobile);

const AppMenu = withRouter(({location}) => (
    <Menu vertical fixed={'left'} style={style.appMenu}>
        {console.log(location)}
        <Menu.Item
            name='consignments'
            to={'/transports'}
            active={location.pathname.startsWith('/transports')}
            as={Link}
        />
        <Menu.Item
            name='settings'
            active={location.pathname.startsWith('/settings')}
            to={'/settings'}
            as={Link}
        />
    </Menu>));

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Menu fixed='top' inverted>
                        <Menu.Item as='a' header>
                            <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
                            Open e-CMR
                        </Menu.Item>
                    </Menu>

                    <AppMenu/>

                    <div style={style.content}>
                        <Route exact path="/transports" component={Transports}/>
                        <Route exact path="/transports-new/:copy_id" component={NewTransport}/>
                        <Route exact path="/transports-new" component={NewTransport}/>
                        <Route exact path="/transports/:id" component={Transport}/>
                    </div>
                </div>
            </Router>
        );
    }
}
export default withAuthenticator(App, false);