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
    static form = [
        {
            section: 'Carrier',
            items: [
                {label: 'Carrier', icon: 'truck', form: <Carrier />},
                {label: 'Driver', icon: 'user', form: <Driver />},
                {label: 'Vehicle license plate', icon: 'truck'},
                {label: 'Trailer license plate', icon: 'truck'}
            ]
        },
        {
            section: 'Shipper',
            items: [
                {label: 'Shipper', icon: 'building'}
            ]
        },
        {
            section: 'Pickup',
            items: [
                {label: 'Pickup', icon: 'sign-out'}
            ]
        },
        {
            section: 'Delivery',
            items: [
                {label: 'Delivery', icon: 'sign-in'}
            ]
        }
    ];

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const menu = NewTransport.form.map((section) => {
            const buttons = section.items.map((item) =>
                <Button toggle={true}
                        content={item.label}
                        icon={item.icon}
                        labelPosition='left'
                        onClick={() => this.activate(item.form)}/>);

            return ([
                    <Header as={'h3'}>{section.section}</Header>,
                    <Button.Group vertical fluid>
                        {buttons}
                    </Button.Group>
                    ]
            );
        });

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
                                { menu }

                                <Divider />
                                <Button floated={"right"}>Save</Button>
                                <Divider clearing hidden fitted />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={1}>
                            <Divider vertical><Icon name='arrow right' /></Divider>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Segment>
                                {this.state.activeItem}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
        )
    }

    activate(item) {
        if (!item) {
            return;
        }

        this.setState({'activeItem': item});
    }
}

export default NewTransport;