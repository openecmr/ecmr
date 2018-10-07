import React, { Component } from 'react';
import './App.css';
import {Container, Grid, Header, Menu} from "semantic-ui-react";
import Transports from "./Transports";


class App extends Component {
    state = { activeItem: 'account' }

    handleItemClick() {

    }

    render() {
        const { activeItem } = this.state;

        return (

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
                                    active={activeItem === 'account'}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item
                                    name='settings'
                                    active={activeItem === 'settings'}
                                    onClick={this.handleItemClick}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Transports/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
        );
    }
}

export default App;