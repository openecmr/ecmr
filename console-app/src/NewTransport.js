import {Component, Fragment} from "react";
import {
    Button,
    Menu,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Label,
    Segment,
    Tab,
    Form,
    Modal, List
} from "semantic-ui-react";
import React from "react";
import Amplify, { Analytics, Storage, API, graphqlOperation } from 'aws-amplify';
import MutationCreateContract from "./graphql/MutationCreateContract"

class NewTransportForm extends Component {
    constructor(props) {
        super(props);

        this.handleInput = this.handleInput.bind(this);
    }

    renderField(label, field) {
        return (
            <Form.Field key={this.item++}>
                <Form.Input onChange={this.handleInput} name={field} value={this.props.value[field]} label={label}/>
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

        this.label = "Enter shipper information";
    }

    renderFields() {
        super.renderFields();

        return (
            <Fragment>
                {this.renderField("Name", "name")}
                {this.renderField("Postal code", "postalCode")}
                {this.renderField("Address", "address")}
                {this.renderField("City", "city")}
                {this.renderField("Country", "country")}
            </Fragment>
        )
    }
}

class Pickup extends NewTransportForm {
    state = { modalOpen: false }
    constructor(props) {
        super(props);

        this.label = "Add a loading point";
    }

    handleChangeForLoad = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    renderFields() {
        super.renderFields();

        let times = [
            {
                "text": "00:00",
                "value": "00:00"
            }
        ];

        return (
            <Fragment>
                {this.renderField("Name", "name")}
                {this.renderField("Postal code", "postalCode")}
                {this.renderField("Address", "address")}
                {this.renderField("City", "city")}
                {this.renderField("Country", "country")}
                <Form.Field key={"pickup"}>
                    <label>Planned pickup date</label>
                    <Form.Group inline >
                        <Form.Input label="On" onChange={this.handleInput} name="pickupDate" value={this.props.value["pickupDate"]} width={8}/>
                    </Form.Group>
                    <Form.Group inline >
                        <Form.Select label="Between" options={times} fluid onChange={this.handleInput} name="pickupTimeBegin" value={this.props.value["pickupTimeBegin"]}/>
                        <Form.Select label="and" options={times} fluid onChange={this.handleInput} name="pickupTimeEnd" value={this.props.value["pickupTimeEnd"]}/>
                    </Form.Group>
                </Form.Field>
                <Header as={'h3'} key={"header"}>Loads</Header>
                {this.showLoad()}
                {this.renderLoads()}
            </Fragment>
        );
    }

    showLoad() {
        const trigger = <Button content={"Add a load"} icon={"plus square"} labelPosition={"left"} onClick={() => this.setState({ modalOpen: true })}/>;

        return (<Modal key={"showLoad"} open={this.state.modalOpen}  trigger={trigger} size='small'>
            <Header icon={"plus square"} content={"Add load"} />
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input label='Category' type='input' name={"category"} onChange={this.handleChangeForLoad}/>
                    <Form.Input label='Quantity' type='input' name={"quantity"} onChange={this.handleChangeForLoad}/>
                    <Form.Input label='Description' type='input' name={"description"} onChange={this.handleChangeForLoad}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted>
                    <Icon name='remove' /> Cancel
                </Button>
                <Button color='green' inverted onClick={() => this.addLoad()}>
                    <Icon name='checkmark' /> Add load
                </Button>
            </Modal.Actions>
        </Modal>);
    }

    addLoad() {
        this.setState({modalOpen: false});
        const load = { ...this.state };
        delete load.modalOpen;
        this.props.onLoadAdded(load);
    }

    renderLoads() {
        return (
            <List divided relaxed>
                {
                    this.props.loads.map(load => {
                        return (<List.Item key={load.description}>
                            <List.Icon name='archive' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header as='a'>{load.quantity} {load.category}</List.Header>
                                <List.Description as='a'>{load.description}</List.Description>
                            </List.Content>
                        </List.Item>);
                    })
                }
            </List>
        )
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
                    {label: 'Carrier', icon: 'truck', form: () => <Carrier onChange={this.createOnUpdateFor('carrier')} value={this.state.carrier} />},
                    {label: 'Driver', icon: 'user', form: () => <Driver onChange={this.createOnUpdateFor('driver')} value={this.state.driver} />},
                    {label: 'Vehicle license plate', icon: 'truck', form: () => <Vehicle onChange={this.createOnUpdateFor('truck')} value={this.state.truck}/>},
                    {label: 'Trailer license plate', icon: 'truck', form: () => <Trailer onChange={this.createOnUpdateFor('trailer')} value={this.state.trailer}/>}
                ]
            },
            {
                section: 'Shipper',
                items: [
                    {label: 'Shipper', icon: 'building', form: () => <Shipper onChange={this.createOnUpdateFor('shipper')} value={this.state.shipper} />}
                ]
            },
            {
                section: 'Pickup',
                items: [
                    {label: 'Pickup', icon: 'sign-out', form: () => <Pickup onChange={this.createOnUpdateFor('pickup')} onLoadAdded={(load) => this.onLoadAdded(load)} value={this.state.pickup} loads={this.state.loads}/> }
                ]
            },
            {
                section: 'Delivery',
                items: [
                    {label: 'Delivery', icon: 'sign-in', form: () => <Shipper onChange={this.createOnUpdateFor('delivery')} value={this.state.delivery} />}
                ]
            }
        ];

        this.state = {
            selectedLabel: this.form[0].items[0].label,
            form: this.form[0].items[0].form,
            carrier: {
            },
            driver: {
            },
            trailer: {
            },
            truck: {
            },
            shipper: {
            },
            delivery: {
            },
            pickup: {
            },
            loads: [
            ]

        };
    }

    onLoadAdded(load) {
        this.setState(prevState => ({
            loads: [...prevState.loads, load]
        }))
    }

    createOnUpdateFor(item) {
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
                                <Button floated={"right"} onClick={() => this.save()}>Save</Button>
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

    save() {
        const input = {
            ...this.state,
            status: 'DRAFT'
        };
        delete input.selectedLabel;
        delete input.form;
        API.graphql(graphqlOperation(MutationCreateContract, {input: input}));
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