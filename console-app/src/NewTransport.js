import {Component} from "react";
import {Button, Menu, Container, Divider, Grid, Header, Icon, Label, Segment, Tab, Form} from "semantic-ui-react";
import React from "react";

class NewTransportForm extends Component {
    constructor(props) {
        super(props);

        this.handleInput = this.handleInput.bind(this);
    }

    renderField(label, field) {
        return (
            <Form.Field key={this.item++}>
                <label>{label}</label>
                <Form.Input onChange={this.handleInput} name={field} value={this.props.value[field]}/>
            </Form.Field>
        );
    }

    renderFields() {
        this.item = 0;
    }

    render() {
        return (
            <Container>
                <Header as={'h3'}>{this.label}</Header>
                <Form>
                    {this.renderFields()}
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

class Carrier extends NewTransportForm {
    constructor(props) {
        super(props);

        this.label = "Enter carrier information";
    }

    renderFields() {
        super.renderFields();

        return (
            [this.renderField("Name", "name"),
                this.renderField("Postal code", "postalCode"),
                this.renderField("Address", "address"),
                this.renderField("City", "city"),
                this.renderField("Country", "country")])
    }
}

class Shipper extends NewTransportForm {
    constructor(props) {
        super(props);

        this.label = "Enter carrier information";
    }

    renderFields() {
        super.renderFields();

        return (
            [this.renderField("Name", "name"),
                this.renderField("Postal code", "postalCode"),
                this.renderField("Address", "address"),
                this.renderField("City", "city"),
                this.renderField("Country", "country")])
    }
}

class Driver extends NewTransportForm {
    constructor(props) {
        super(props);

        this.label = "Enter driver information";
    }

    renderFields() {
        super.renderFields();

        return ([
           this.renderField("Name", "name")
        ]);
    }
}

class Vehicle extends NewTransportForm {
    constructor(props) {
        super(props);

        this.label = "Enter vehicle information";
    }

    renderFields() {
        super.renderFields();

        return ([
            this.renderField("Vehicle license plate", "licensePlate")
        ]);
    }
}

class Trailer extends NewTransportForm {
    constructor(props) {
        super(props);

        this.label = "Enter trailer information";
    }

    renderFields() {
        super.renderFields();

        return ([
            this.renderField("Trailer license plate", "licensePlate")
        ]);
    }
}

class NewTransport extends Component {
    constructor(props) {
        super(props);

        this.form = [
            {
                section: 'Carrier',
                items: [
                    {label: 'Carrier', icon: 'truck', form: () => <Carrier onChange={this.updateItem('carrier')} value={this.state.carrier} />},
                    {label: 'Driver', icon: 'user', form: () => <Driver onChange={this.updateItem('driver')} value={this.state.driver} />},
                    {label: 'Vehicle license plate', icon: 'truck', form: () => <Vehicle onChange={this.updateItem('vehicle')} value={this.state.vehicle}/>},
                    {label: 'Trailer license plate', icon: 'truck', form: () => <Trailer onChange={this.updateItem('trailer')} value={this.state.trailer}/>}
                ]
            },
            {
                section: 'Shipper',
                items: [
                    {label: 'Shipper', icon: 'building', form: () => <Shipper onChange={this.updateItem('shipper')} value={this.state.shipper} />}
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

        this.state = {
            selectedLabel: this.form[0].items[0].label,
            form: this.form[0].items[0].form,
            carrier: {
                name: '',
                postalCode: ''
            },
            driver: {
                name: ''
            },
            trailer: {
                licensePlate: ''
            },
            vehicle: {
                licensePlate: ''
            },
            shipper: {
            }

        };
    }

    updateItem(item) {
        let func = (value) => {
            let newState = {
            };
            newState[item] = Object.assign({}, this.state[item], value);
            this.setState(newState)
        };

        func.bind(this);
        return func;
    }

    render() {
        const menu = this.form.map((section) => {
            const buttons = section.items.map((item) =>
                <Button toggle={true}
                        key={item.label}
                        active={item.label === this.state.selectedLabel}
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

        this.setState({
            'form': item.form,
            'selectedLabel': item.label
        });
    }
}

export default NewTransport;