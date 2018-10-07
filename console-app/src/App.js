import React, { Component } from 'react';
import './App.css';
import {Container, Grid, Header, Menu} from "semantic-ui-react";
import Transports from "./Transports";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class App extends Component {
    render() {
        return (
            <Router>
                <Grid columns={2} container style={{ padding: '1em 0em' }}>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as={'h2'}>e-CMR console app</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Menu vertical secondary>
                                <Menu.Item
                                    name='consignments'
                                    to={'/transports'}
                                    as={Link}
                                />
                                <Menu.Item
                                    name='settings'
                                    to={'/settings'}
                                    as={Link}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Route exact path="/transports" component={Transports} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Router>
        );
    }
}

export default App;