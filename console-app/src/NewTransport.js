import {Component} from "react";
import {Button, Menu, Container, Divider, Grid, Header, Icon, Label, Segment, Tab, Form} from "semantic-ui-react";
import React from "react";

class Driver extends Component {
    render() {
        return (
            <Container>
                <Header as={'h3'}>Enter driver information</Header>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <input placeholder='Name' />
                    </Form.Field>
                </Form>
            </Container>
        );
    }
}

class Carrier extends Component {
    render() {
        return (
            <Container>
                <Header as={'h3'}>Enter carrier information</Header>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <input />
                    </Form.Field>
                    <Form.Field>
                        <label>Postal code</label>
                        <input />
                    </Form.Field>
                    <Form.Field>
                        <label>Address</label>
                        <input />
                    </Form.Field>
                    <Form.Field>
                        <label>City</label>
                        <input  />
                    </Form.Field>
                    <Form.Field>
                        <label>Country</label>
                        <input />
                    </Form.Field>
                </Form>
            </Container>
        );
    }
}

class Vehicle extends Component {
    render() {
        return (
            <Container>
                <Header as={'h3'}>Enter carrier information</Header>
                <Form>
                    <Form.Field>
                        <label>Vehicle license plate</label>
                        <input />
                    </Form.Field>
                </Form>
            </Container>
        )
    }
}

class Trailer extends Component {
    render() {
        return (
            <Container>
                <Header as={'h3'}>Enter carrier information</Header>
                <Form>
                    <Form.Field>
                        <label>Trailer license plate</label>
                        <input />
                    </Form.Field>
                </Form>
            </Container>
        )
    }
}


class NewTransport extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
                <Grid columns={2} container style={{ padding: '1em 0em' }}>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as={'h2'}>New A -> B Transport</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Segment>
                                <Header as={'h3'}>Carrier</Header>
                                <Button.Group vertical fluid>
                                    <Button toggle={true} active={true} onClick={() => this.activate('carrier')}>Carrier</Button>
                                    <Button onClick={() => this.activate('driver')}>Driver</Button>
                                    <Button onClick={() => this.activate('vehicleLicensePlate')}>Vehicle license plate</Button>
                                    <Button onClick={() => this.activate('trailerLicensePlate')}>Trailer license plate</Button>
                                </Button.Group>

                                <Header as={'h3'}>Shipper</Header>
                                <Button.Group vertical fluid>
                                    <Button>Shipper</Button>
                                </Button.Group>

                                <Header as={'h3'}>Pickup</Header>
                                <Button.Group vertical fluid>
                                    <Button>Shipper</Button>
                                </Button.Group>

                                <Header as={'h3'}>Delivery</Header>
                                <Button.Group vertical fluid>
                                    <Button>Delivery</Button>
                                </Button.Group>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={1}>
                            <Divider vertical><Icon name='arrow right' /></Divider>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Segment>
                                {this.renderActiveItem()}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
        )
    }

    activate(item) {
        this.setState({'activeItem': item});
    }

    renderActiveItem() {
        console.log(this.state.activeItem);

        switch(this.state.activeItem) {
            case 'carrier':
                return <Carrier/>;
            case 'driver':
                return <Driver/>;
            case 'vehicleLicensePlate':
                return <Vehicle/>;
            case 'trailerLicensePlate':
                return <Trailer/>;
            default:
                return;
        }
    }
}

export default NewTransport;