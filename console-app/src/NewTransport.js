import {Component, Fragment} from "react";
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Segment,
    Form,
    Modal, List, Dropdown
} from "semantic-ui-react";
import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from './graphql/mutations'
import * as queries from "./graphql/queries";
import moment from "moment";
import Message from "semantic-ui-react/dist/commonjs/collections/Message/Message";

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

class ContactPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };

        this.loadContacts();
    }

    async loadContacts() {
        const response = await API.graphql(graphqlOperation(queries.listContacts, {
            limit: 1000
        }));
        this.setState({
            options: response.data.listContacts.items.map(e => ({text: `${e.name}, ${e.address}, ${e.country}`, key: e.id, value: e.id}))
        });
    }

    render() {
        const { address } = this.props;

        return (
            <div style={{marginBottom: '15px'}}>
                <Dropdown
                    placeholder='Select contact'
                    fluid
                    search
                    clearable
                    selection
                    value={this.props.contactId}
                    onChange={(e, data) => {this.props.contactSelected(data.value)}}
                    options={this.state.options}
                />
                {address && (
                    <List>
                        <List.Item>
                            <List.Content><strong>{address.name}</strong></List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>{address.address}</List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>{address.postalCode} {address.city}{address.country && `, ${address.country}`}</List.Content>
                        </List.Item>
                    </List>)}
            </div>
        )
    }

    close() {
        this.setState({addingItem: false});
    }

    addItem() {
        this.setState({addingItem: true});
    }
}

class DriverPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };

        this.loadDrivers();
    }

    async loadDrivers() {
        const response = await API.graphql(graphqlOperation(queries.listDrivers, {
            limit: 1000
        }));
        this.setState({
            options: response.data.listDrivers.items.map(e => ({text: `${e.name}`, key: e.id, value: e.id})),
            drivers: response.data.listDrivers.items.reduce((map, obj) => {
                map[obj.id] = obj;
                return map;
            }, {})
        });
    }

    render() {
        return (
            <div style={{marginBottom: '15px'}}>
                <Dropdown
                    placeholder='Select driver'
                    fluid
                    search
                    clearable
                    selection
                    value={this.props.driverId}
                    onChange={(e, data) => {this.props.driverSelected(this.state.drivers[data.value])}}
                    options={this.state.options}
                />
            </div>
        )
    }
}

class Carrier extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <Header as={'h3'}>Enter carrier information</Header>
            <ContactPicker contactSelected={(contactId) => {this.props.contactSelected(contactId)}}
                           contactId={this.props.contactId} />

        </div>);
    }
}



class Shipper extends NewTransportForm {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <Header as={'h3'}>Enter shipper information</Header>
            <ContactPicker contactSelected={(contactId) => {this.props.contactSelected(contactId)}}
                           contactId={this.props.contactId} />

        </div>);
    }
}

class Delivery extends NewTransportForm {
    constructor(props) {
        super(props);

        this.label = "Enter delivery address";
    }

    renderFields() {
        super.renderFields();

        return (
            <Fragment>
                <ContactPicker contactSelected={(contactId) => {this.props.contactSelected(contactId)}}
                               contactId={this.props.contactId} />

                <Form.Field key={"pickup"}>
                    <label>Planned delivery date</label>
                    <Form.Group inline >
                        <Form.Input label="On" onChange={this.handleInput} name="deliveryDate" value={this.props.value["deliveryDate"]} type={'date'} width={8}/>
                    </Form.Group>
                </Form.Field>
            </Fragment>
        )
    }
}

class Pickup extends NewTransportForm {
    emptyLoad = {
        category: '',
        quantity: '',
        description: ''
    };
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
                <ContactPicker contactSelected={(contactId) => {this.props.contactSelected(contactId)}}
                               contactId={this.props.contactId} />

                <Form.Field key={"pickup"}>
                    <label>Planned pickup date</label>
                    <Form.Group inline >
                        <Form.Input label="On" onChange={this.handleInput} name="pickupDate" value={this.props.value["pickupDate"]} type={'date'} width={8}/>
                    </Form.Group>
                </Form.Field>
                <Header as={'h3'} key={"header"}>Loads</Header>
                {this.showLoad()}
                {this.renderLoads()}
            </Fragment>
        );
    }

    showLoad() {
        const trigger = <Button content={"Add a load"} icon={"plus square"} labelPosition={"left"} onClick={() => this.setState({ modalOpen: true, index: null, ...this.emptyLoad })}/>;

        return (<Modal open={this.state.modalOpen}  trigger={trigger} size='small' key={this.state.index}>
            <Header icon={"plus square"} content={"Add load"} />
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input label='Category' type='input' name={"category"} value={this.state.category} onChange={this.handleChangeForLoad}/>
                    <Form.Input label='Quantity' type='input' name={"quantity"} value={this.state.quantity} onChange={this.handleChangeForLoad}/>
                    <Form.Input label='Description' type='input' name={"description"} value={this.state.description} onChange={this.handleChangeForLoad}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                {this.state.index !== null &&
                (<Button color='red' inverted onClick={() => this.removeLoad()}>
                    <Icon name='remove' /> Remove
                </Button>)}

                <Button color='red' inverted onClick={() => this.setState({modalOpen: false})}>
                    <Icon name='cancel' /> Cancel
                </Button>
                <Button color='green' inverted onClick={() => this.addLoad()}>
                    <Icon name='checkmark' /> Add load
                </Button>
            </Modal.Actions>
        </Modal>);
    }

    removeLoad() {
        this.setState({modalOpen: false});
        this.props.onLoadRemoved(this.state.index);
    }

    addLoad() {
        this.setState({modalOpen: false});
        const index = this.state.index;
        const load = { ...this.state };

        delete load.modalOpen;
        delete load.index;
        this.props.onLoadAdded(index, load);
    }

    renderLoads() {
        return (
            <List divided relaxed>
                {
                    this.props.loads.map((load, index) => {
                        return (<List.Item key={index} onClick={() => this.setState({
                            modalOpen: true,
                            index: index,
                            ...load
                        })}>
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

class Driver extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <Header as={'h3'}>Enter driver information</Header>
            <DriverPicker driverSelected={(driver) => {this.props.driverSelected(driver)}}
                           driverId={this.props.driverId} />

        </div>);
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
                    {label: 'Carrier', icon: 'truck', form: () =>
                            <Carrier
                                contactSelected={(contactId) => this.setState({'carrierContactId' : contactId})}
                                contactId={this.state.carrierContactId}
                            />},
                    {label: 'Driver', icon: 'user', form: () => <Driver
                            driverSelected={(driver) => this.setState({
                                'driverDriverId' : driver.id,
                                'carrierUsername': driver.carrier
                            })}
                            driverId={this.state.driverDriverId}
                        />},
                    {label: 'Vehicle license plate', icon: 'truck', form: () => <Vehicle onChange={this.createOnUpdateFor('truck')} value={this.state.truck}/>},
                    {label: 'Trailer license plate', icon: 'truck', form: () => <Trailer onChange={this.createOnUpdateFor('trailer')} value={this.state.trailer}/>}
                ]
            },
            {
                section: 'Shipper',
                items: [
                    {label: 'Shipper', icon: 'building', form: () =>
                            <Shipper  contactSelected={(contactId) => this.setState({'shipperContactId' : contactId})}
                                      contactId={this.state.shipperContactId} />}
                ]
            },
            {
                section: 'Pickup',
                items: [
                    {label: 'Pickup', icon: 'sign-out', form: () =>
                            <Pickup contactSelected={(contactId) => this.setState({
                                'pickup': {
                                    ...this.state.pickup,
                                    contactId
                                }
                            })}
                                    onChange={this.createOnUpdateFor('pickup', this.copyDateToDelivery)}
                                    onLoadAdded={(index, load) => this.onLoadAdded(index, load)}
                                    onLoadRemoved={(index) => this.onLoadRemoved(index)}
                                    contactId={this.state.pickup.contactId}
                                    value={this.state.pickup}
                                    loads={this.state.loads}/> }
                ]
            },
            {
                section: 'Delivery',
                items: [
                    {label: 'Delivery', icon: 'sign-in', form: () =>
                            <Delivery onChange={this.createOnUpdateFor('delivery')}
                                      contactSelected={(contactId) => this.setState({'delivery': {
                                          ...this.state.delivery,
                                          contactId
                                          }
                                      })}
                                      contactId={this.state.delivery.contactId}
                                      value={this.state.delivery} />}
                ]
            }
        ];

        this.state = {
            selectedLabel: this.form[0].items[0].label,
            form: this.form[0].items[0].form,
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
            ],
            loading: false
        };

        const copyId = this.props.match.params.copy_id;
        if (copyId) {
            this.copyFromExisting(copyId);
        }
    }

    copyDateToDelivery(newState) {
        if (newState.pickupDate && !this.state.delivery.deliveryDate) {
            this.setState({
                delivery: {
                    ...this.state.delivery,
                    deliveryDate: newState.pickupDate
                }
            })
        }
    }

    async copyFromExisting(id) {
        const response = await API.graphql(graphqlOperation(queries.getContract, {
            "id": id
        }));
        const contract = response.data.getContract;

        this.setState({
            carrierContactId: contract.carrierContactId,
            shipperContactId: contract.shipperContactId,
            driverDriverId: contract.driverDriverId,
            carrierUsername: contract.carrierUsername,
            trailer: {
                licensePlate: contract.trailer
            },
            truck: {
                licensePlate: contract.truck
            },
            delivery: {
                contactId: contract.deliveryContactId,
                deliveryDate: contract.deliveryDate
            },
            pickup: {
                contactId: contract.pickupContactId,
                pickupDate: contract.arrivalDate
            },
            loads: contract.loads
        });
    }

    onLoadAdded(index, load) {
        console.log(load);
        const loads = [...this.state.loads];
        if (index !== null) {
            loads[index] = {...load};
        } else {
            loads.push(load);
        }

        this.setState({
            loads: loads
        });
    }


    onLoadRemoved(index) {
        this.state.loads.splice(index, 1);
    }

    createOnUpdateFor(item, customCallback) {
        let func = (value) => {
            let newState = {
            };
            newState[item] = Object.assign({}, this.state[item], value);

            if (customCallback) {
                customCallback.call(this, newState[item]);
            }

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
                <Grid columns={2} container stackable style={{ padding: '1em 0em' }}>
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
                                {this.state.error && <Message
                                    error
                                    header='Error'
                                    list={[
                                        this.state.error
                                    ]}
                                />}
                                <Button floated={"right"} loading={this.state.loading} onClick={() => this.save()}>Save</Button>
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

    async save() {
        this.setState({
            loading: true
        });

        try {
            const copyToAddress = async (contactId) => {
                const address = (await API.graphql(graphqlOperation(queries.getContact, {
                    id: contactId
                }))).data.getContact;
                return {
                    name: address.name,
                    postalCode: address.postalCode,
                    address: address.address,
                    city: address.city,
                    country: address.country
                };
            };

            const copyToDriverDetail = async (driverId) => {
                const driver = (await API.graphql(graphqlOperation(queries.getDriver, {
                    id: driverId
                }))).data.getDriver;
                return {
                    name: driver.name
                };
            };

            const now = moment().toISOString();
            const input = {
                status: 'CREATED',
                arrivalDate: this.state.pickup.pickupDate,
                deliveryDate: this.state.delivery.deliveryDate,

                carrierUsername: this.state.carrierUsername,
                loads: this.state.loads,
                trailer: this.state.trailer.licensePlate,
                truck: this.state.truck.licensePlate,
                events: [],
                updatedAt: now,
                createdAt: now,

                shipper: await copyToAddress(this.state.shipperContactId),
                carrier: await copyToAddress(this.state.carrierContactId),
                delivery: await copyToAddress(this.state.delivery.contactId),
                pickup: await copyToAddress(this.state.pickup.contactId),
                driver: await copyToDriverDetail(this.state.driverDriverId),

                shipperContactId: this.state.shipperContactId,
                carrierContactId: this.state.carrierContactId,
                deliveryContactId: this.state.delivery.contactId,
                pickupContactId: this.state.pickup.contactId,
                driverDriverId: this.state.driverDriverId
            };

            console.log(input);

            await API.graphql(graphqlOperation(mutations.createContract, {input: input}));
            this.props.history.push('/transports')
        } catch (ex) {
            console.warn("error while creating transport" + JSON.stringify(ex));
            this.setState({
                error: "Cannot create transport because validation failed. Please ensure all fields are filled in.",
                loading: false
            })
        }
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