import {Component} from "react";
import {Button, Menu, Container, Divider, Grid, Header, Icon, Label, Segment, Tab, Form} from "semantic-ui-react";
import React from "react";

class Driver extends Component {
    constructor(props) {
        super(props);

        this.handleInput = this.handleInput.bind(this);
    }

    render() {
        return (
            <Container>
                <Header as={'h3'}>Enter driver information</Header>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <Form.Input onChange={this.handleInput}  placeholder='Name' name='name' value={this.props.value.name}/>
                    </Form.Field>
                </Form>
            </Container>
        );
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const newFormState = Object.assign({}, this.props.value, {[name]: value});

        this.props.onChange(newFormState);
    }
}

class Carrier extends Component {
    constructor(props) {
        super(props);

        this.handleInput = this.handleInput.bind(this);
    }

    render() {
        return (
            <Container>
                <Header as={'h3'}>Enter carrier information</Header>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <Form.Input onChange={this.handleInput} name="name" value={this.props.value.name}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Postal code</label>
                        <Form.Input onChange={this.handleInput} name="postalCode" value={this.props.value.postalCode}/>
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

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const newFormState = Object.assign({}, this.props.value, {[name]: value});

        this.props.onChange(newFormState);
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
            carrier: {
                name: '',
                postalCode: ''
            },
            driver: {
                name: ''
            }
        };

        this.updateCarrier = this.updateCarrier.bind(this);
        this.updateDriver = this.updateDriver.bind(this);

    }

    updateCarrier(carrier) {
        this.setState({
            'carrier': Object.assign({}, this.state.carrier, carrier)
        })
    }

    updateDriver(driver) {
        this.setState({
            'driver': Object.assign({}, this.state.driver, driver)
        })
    }

    render() {
        let form = [
            {
                section: 'Carrier',
                items: [
                    {label: 'Carrier', icon: 'truck', form: () => <Carrier onChange={this.updateCarrier} value={this.state.carrier} />},
                    {label: 'Driver', icon: 'user', form: () => <Driver onChange={this.updateDriver} value={this.state.driver} />},
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

        const menu = form.map((section) => {
            const buttons = section.items.map((item) =>
                <Button toggle={true}
                        key={item.label}
                        content={item.label}
                        icon={item.icon}
                        labelPosition='left'
                        onClick={() => this.activate(item)}/>);

            return (<Segment key={section.section}>
                        <Header as={'h3'}>{section.section}</Header>
                        <Button.Group vertical fluid>
                            {buttons}
                        </Button.Group>
                    </Segment>
            );
        });

        let activeForm = this.state.form ? this.state.form() : null;

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
                                {activeForm}
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

        this.setState({'form': item.form});
    }
}

export default NewTransport;