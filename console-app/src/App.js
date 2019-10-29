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

Amplify.configure(awsmobile);

const AppMenu = withRouter(({location}) => (
    <Menu fluid vertical tabular>
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
                        <Container>
                            <Menu.Item as='a' header>
                                <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
                                Open e-CMR
                            </Menu.Item>
                        </Container>
                    </Menu>
                    <Container style={{paddingTop: '75px'}}>
                        <Grid columns={2} stackable>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <AppMenu/>
                                </Grid.Column>
                                <Grid.Column width={13}>
                                    <Route exact path="/transports" component={Transports}/>
                                    <Route exact path="/transports-new/:copy_id" component={NewTransport}/>
                                    <Route exact path="/transports-new" component={NewTransport}/>
                                    <Route exact path="/transports/:id" component={Transport}/>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
            </Router>
        );
    }
}
export default withAuthenticator(App, false);