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
import {API, Auth, graphqlOperation, I18n} from 'aws-amplify';
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
        const user = await Auth.currentAuthenticatedUser();
        const response = await API.graphql(graphqlOperation(queries.contactByOwner, {
            limit: 50,
            owner: user.getUsername()
        }));
        this.setState({
            options: response.data.contactByOwner.items.map(e => ({text: [e.name, e.address, e.country].filter(Boolean).join(", "), key: e.id, value: e.id}))
        });
    }

    render() {
        const { address } = this.props;

        return (
            <div style={{marginBottom: '15px'}}>
                <Dropdown
                    placeholder={I18n.get('Select contact')}
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
        const user = await Auth.currentAuthenticatedUser();
        const response = await API.graphql(graphqlOperation(queries.driverByOwner, {
            limit: 50,
            owner: user.getUsername()
        }));
        this.setState({
            options: response.data.driverByOwner.items.map(e => ({text: `${e.name}`, key: e.id, value: e.id})),
            drivers: response.data.driverByOwner.items.reduce((map, obj) => {
                map[obj.id] = obj;
                return map;
            }, {})
        });
    }

    render() {
        return (
            <div style={{marginBottom: '15px'}}>
                <Dropdown
                    placeholder={I18n.get('Select driver')}
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

class VehiclePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };

        this.loadVehicles();
    }

    async loadVehicles() {
        const user = await Auth.currentAuthenticatedUser();
        const response = await API.graphql(graphqlOperation(queries.vehicleByOwner, {
            limit: 50,
            owner: user.getUsername(),
            filter: {
                type: {
                    eq: this.props.type
                }
            }
        }));
        this.setState({
            options: response.data.vehicleByOwner.items.map(e => ({text: `${e.licensePlateNumber}, ${e.description}`, key: e.id, value: e.id})),
            vehicles: response.data.vehicleByOwner.items.reduce((map, obj) => {
                map[obj.id] = obj;
                return map;
            }, {})
        });
    }

    render() {
        return (
            <div style={{marginBottom: '15px'}}>
                <Dropdown
                    placeholder={I18n.get('Select vehicle')}
                    fluid
                    search
                    clearable
                    selection
                    value={this.props.vehicleId}
                    onChange={(e, data) => {this.props.vehicleSelected(this.state.vehicles[data.value])}}
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
            <Header as={'h3'}>{I18n.get('Enter carrier information')}</Header>
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
            <Header as={'h3'}>{I18n.get('Enter shipper information')}</Header>
            <ContactPicker contactSelected={(contactId) => {this.props.contactSelected(contactId)}}
                           contactId={this.props.contactId} />

        </div>);
    }
}

class Delivery extends NewTransportForm {
    constructor(props) {
        super(props);

        this.label = I18n.get("Enter delivery address");
    }

    renderFields() {
        super.renderFields();

        return (
            <Fragment>
                <ContactPicker contactSelected={(contactId) => {this.props.contactSelected(contactId)}}
                               contactId={this.props.contactId} />

                <Form.Field key={"pickup"}>
                    <label>{I18n.get('Planned delivery date')}</label>
                    <Form.Group inline >
                        <Form.Input label={I18n.get("On")} onChange={this.handleInput} name="deliveryDate" value={this.props.value["deliveryDate"]} type={'date'}/>
                        <Form.Input
                            label={I18n.get("Between")}
                            placeholder={"12:05"}
                            onChange={this.handleInput}
                            name="deliveryFromTime"
                            value={this.props.value["deliveryFromTime"]} type={'time'} />
                        <Form.Input
                            label={I18n.get("And")}
                            placeholder={"12:15"}
                            onChange={this.handleInput}
                            name="deliveryEndTime"
                            value={this.props.value["deliveryEndTime"]} type={'time'} />
                    </Form.Group>
                </Form.Field>
            </Fragment>
        )
    }
}

const categoryOptions = () => [
    {text: I18n.get('pallets'), value: 'pallets'},
    {text: I18n.get('packages'), value: 'packages'},
    {text: I18n.get('roll containers'), value: 'roll containers'},
    {text: I18n.get('bulk'), value: 'bulk'}
];
const CategoryDropdown = ({onChange, value}) =>
    <Dropdown options={categoryOptions()} clearable={true} fluid
              // onChange={(e, data) => {onChange(data.value)}}
              onChange={(e, data) => onChange(e, {
                  name: "category",
                  value: data.value
              })}
              value={value} search
              selection/>;

class Pickup extends NewTransportForm {
    emptyLoad = {
        category: '',
        quantity: '',
        volume: '',
        loadMeters: '',
        netWeight: '',
        description: ''
    };
    state = {
        modalOpen: false
    };

    constructor(props) {
        super(props);

        this.label = I18n.get("Add a loading point");
    }

    handleChangeForLoad = (e, { name, value }) => {
        const floatFields = ["volume", "netWeight", "loadMeters"];
        if (name === 'quantity' && !/^[0-9]*$/.test(value)) {
            return;
        } else if (floatFields.indexOf(name) !== -1 && !/^[0-9]*([.,][0-9]{0,3})?$/.test(value)) {
            return;
        }

        value = floatFields.indexOf(name) !== -1 ? value.replace(",", ".") : value;
        this.setState({ [name]: value });
    };

    renderFields() {
        super.renderFields();

        return (
            <Fragment>
                <ContactPicker contactSelected={(contactId) => {this.props.contactSelected(contactId)}}
                               contactId={this.props.contactId} />

                <Form.Field key={"pickup"}>
                    <label>{I18n.get('Planned pickup date')}</label>
                    <Form.Group inline >
                        <Form.Input label={I18n.get("On")} onChange={this.handleInput} name="pickupDate"
                                    value={this.props.value["pickupDate"]} type={'date'} />

                        <Form.Input
                            label={I18n.get("Between")}
                            placeholder={"12:05"}
                            onChange={this.handleInput}
                            name="pickupFromTime"
                            value={this.props.value["pickupFromTime"]} type={'time'} />
                        <Form.Input
                            label={I18n.get("And")}
                            placeholder={"12:15"}
                            onChange={this.handleInput}
                            name="pickupEndTime"
                            value={this.props.value["pickupEndTime"]} type={'time'} />
                    </Form.Group>
                </Form.Field>
                <Header as={'h3'} key={"header"}>{I18n.get('Loads')}</Header>
                {this.showLoad()}
                {this.renderLoads()}
            </Fragment>
        );
    }

    showLoad() {
        const trigger = <Button content={I18n.get("Add a load")} icon={"plus square"} labelPosition={"left"} onClick={() => this.setState({ modalOpen: true, index: null, ...this.emptyLoad })}/>;

        return (<Modal open={this.state.modalOpen}  trigger={trigger} size='small' key={this.state.index}>
            <Header icon={"plus square"} content={I18n.get("Add load")} />
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Field label={I18n.get('Category')}
                                name={"category"}
                                control={CategoryDropdown}
                                value={this.state.category}
                                onChange={this.handleChangeForLoad}/>
                    {/*<CategoryDropdown />*/}
                    <Form.Group>
                        <Form.Input label={I18n.get('Quantity')} type='text' size={"mini"} name={"quantity"} value={this.state.quantity || ''} onChange={this.handleChangeForLoad}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Input label={I18n.get('Volume (m³)')} type={'text'} size={"mini"} name={"volume"} value={this.state.volume || ''} onChange={this.handleChangeForLoad}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Input  label={I18n.get('Net weight (kg)')} type={'text'} size={"mini"} name={"netWeight"} value={this.state.netWeight || ''} onChange={this.handleChangeForLoad}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Input  label={I18n.get('Load meters (m)')} type={'text'} size={"mini"} name={"loadMeters"} value={this.state.loadMeters || ''} onChange={this.handleChangeForLoad}/>
                    </Form.Group>
                    <Form.Input label={I18n.get('Description')} type='input' name={"description"} value={this.state.description} onChange={this.handleChangeForLoad}/>

                </Form>
            </Modal.Content>
            <Modal.Actions>
                {this.state.index !== null &&
                (<Button color='red' inverted onClick={() => this.removeLoad()}>
                    <Icon name='remove' /> {I18n.get('Remove')}
                </Button>)}

                <Button color='red' inverted onClick={() => this.setState({modalOpen: false})}>
                    <Icon name='cancel' /> {I18n.get('Cancel')}
                </Button>
                <Button color='green' inverted onClick={() => this.addLoad()}>
                    <Icon name='checkmark' /> {I18n.get('Add load')}
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
                                <List.Header as='a'>{load.quantity} {I18n.get(load.category)}</List.Header>
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
            <Header as={'h3'}>{I18n.get('Enter driver information')}</Header>
            <DriverPicker driverSelected={(driver) => {this.props.driverSelected(driver)}}
                           driverId={this.props.driverId} />

        </div>);
    }
}

class Vehicle extends NewTransportForm {
    constructor(props) {
        super(props);

        this.label = I18n.get("Enter vehicle information");
    }

    render() {
        return (
            <div>
                <Header as={'h3'}>{I18n.get('Enter truck information')}</Header>
                <VehiclePicker type={"TRUCK"}  companyId={this.props.companyId}
                               vehicleSelected={(vehicleId) => {this.props.truckSelected(vehicleId)}}
                               vehicleId={this.props.truckId} />

            </div>
        );
    }
}

class Trailer extends NewTransportForm {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header as={'h3'}>{I18n.get('Enter trailer information')}</Header>
                <VehiclePicker type={"TRAILER"}  companyId={this.props.companyId}
                               vehicleSelected={(vehicleId) => {this.props.trailerSelected(vehicleId)}}
                               vehicleId={this.props.trailerId} />
            </div>
        );
    }
}

class NewTransport extends Component {
    constructor(props) {
        super(props);

        this.form = [
            {
                section: I18n.get('Carrier'),
                items: [
                    {label: I18n.get('Carrier'), icon: 'truck', form: () =>
                            <Carrier
                                contactSelected={(contactId) => this.setState({'carrierContactId' : contactId})}
                                contactId={this.state.carrierContactId}
                            />},
                    {label: I18n.get('Driver'), icon: 'user', form: () => <Driver
                            driverSelected={(driver) => this.setState({
                                driverDriverId : driver ? driver.id : null,
                                carrierUsername: (driver && driver.carrier) ? driver.carrier : "-"
                            })}
                            driverId={this.state.driverDriverId}
                        />},
                    {label: I18n.get('Vehicle license plate'), icon: 'truck', form: () => <Vehicle
                            companyId={this.props.company.id}
                            truckSelected={(vehicle) => this.setState({
                                truckVehicleId: vehicle ? vehicle.id : null,
                                    truck: vehicle ? vehicle.licensePlateNumber : null
                            })}
                            truckId={this.state.truckVehicleId}
                        />},
                    {label: I18n.get('Trailer license plate'), icon: 'truck', form: () => <Trailer
                            companyId={this.props.company.id}
                            trailerSelected={(vehicle) => this.setState({
                                trailerVehicleId: vehicle ? vehicle.id : null,
                                trailer: vehicle ? vehicle.licensePlateNumber : null
                            })}
                            trailerId={this.state.trailerVehicleId}
                        />

                    }
                ]
            },
            {
                section: I18n.get('Shipper'),
                items: [
                    {label: I18n.get('Shipper'), icon: 'building', form: () =>
                            <Shipper  contactSelected={(contactId) => this.setState({'shipperContactId' : contactId})}
                                      contactId={this.state.shipperContactId} />}
                ]
            },
            {
                section: I18n.get('Pickup'),
                items: [
                    {label: I18n.get('Pickup'), icon: 'sign-out', form: () =>
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
                section: I18n.get('Delivery'),
                items: [
                    {label: I18n.get('Delivery'), icon: 'sign-in', form: () =>
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
            trailer: '',
            truck: '',
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

            trailerVehicleId: contract.trailerVehicleId,
            trailer: contract.trailer,
            truckVehicleId: contract.truckVehicleId,
            truck: contract.truck,

            delivery: {
                contactId: contract.deliveryContactId,
                deliveryDate: contract.deliveryDate,
                ...(contract.deliveryTime && {
                    deliveryFromTime: contract.deliveryTime.start,
                    deliveryEndTime: contract.deliveryTime.end
                })
            },
            pickup: {
                contactId: contract.pickupContactId,
                pickupDate: contract.arrivalDate,
                ...(contract.arrivalTime && {
                    pickupFromTime: contract.arrivalTime.start,
                    pickupEndTime: contract.arrivalTime.end
                })
            },
            loads: contract.loads
        });
    }

    onLoadAdded(index, load) {
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
                            <Header as={'h2'}>{I18n.get('New A -&gt; B Transport').replace('&gt;', '>')}</Header>
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
                                <Button floated={"right"} loading={this.state.loading} onClick={() => this.save()}>{I18n.get('Save')}</Button>
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

    validate() {
        let error;
        if (!this.state.carrierContactId) {
            error = I18n.get("Missing carrier address");
        } else if (!this.state.truckVehicleId) {
            error = I18n.get("Missing truck");
        }  else if (!this.state.shipperContactId) {
            error = I18n.get("Missing shipper address");
        } else if (!this.state.pickup.contactId) {
            error = I18n.get("Missing pickup address");
        } else if (!this.state.pickup.pickupDate) {
            error = I18n.get("Missing pickup date");
        } else if (!this.state.delivery.contactId) {
            error = I18n.get("Missing delivery address");
        }  else if (!this.state.delivery.deliveryDate) {
            error = I18n.get("Missing delivery date");
        } else if (this.state.loads.length === 0) {
            error = I18n.get("Need at least one load item");
        }
        this.setState({
            error
        });
        return !error;
    }

    async save() {
        if (this.state.loading || !this.validate()) {
            return;
        }
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
                owner: (await Auth.currentAuthenticatedUser()).getUsername(),
                status: 'CREATED',
                arrivalDate: this.state.pickup.pickupDate,
                ...(this.state.pickup.pickupFromTime &&
                    this.state.pickup.pickupEndTime && {
                        arrivalTime: {
                            start: this.state.pickup.pickupFromTime,
                            end: this.state.pickup.pickupEndTime
                        }
                    }),
                deliveryDate: this.state.delivery.deliveryDate,
                ...(this.state.delivery.deliveryFromTime &&
                    this.state.delivery.deliveryEndTime && {
                        deliveryTime: {
                            start: this.state.delivery.deliveryFromTime,
                            end: this.state.delivery.deliveryEndTime
                        }
                    }),
                carrierUsername: this.state.carrierUsername,
                loads: this.state.loads.map(removeEmpty),
                trailer: this.state.trailer,
                truck: this.state.truck,
                updatedAt: now,
                createdAt: now,

                shipper: await copyToAddress(this.state.shipperContactId),
                carrier: await copyToAddress(this.state.carrierContactId),
                delivery: await copyToAddress(this.state.delivery.contactId),
                pickup: await copyToAddress(this.state.pickup.contactId),
                ...(this.state.driverDriverId && {
                        driver: await copyToDriverDetail(this.state.driverDriverId)
                    }
                ),
                ...(this.props.company && {
                    creator: {
                        name: this.props.company.name
                    },
                    creatorCompanyId: this.props.company.id
                }),
                events: [],
                needAcknowledge: !!this.state.driverDriverId,
                shipperContactId: this.state.shipperContactId,
                carrierContactId: this.state.carrierContactId,
                deliveryContactId: this.state.delivery.contactId,
                pickupContactId: this.state.pickup.contactId,
                driverDriverId: this.state.driverDriverId,
                truckVehicleId: this.state.truckVehicleId,
                trailerVehicleId: this.state.trailerVehicleId
            };

            if (this.state.driverDriverId) {
                input.events.push({
                    author: {
                        username: (await Auth.currentAuthenticatedUser()).getUsername()
                    },
                    type: 'AssignDriver',
                    createdAt: now,
                    assignedDriver: {
                        name: input.driver.name,
                        username: input.carrierUsername
                    }
                });
            } else {
                input.carrierUsername = "-";
            }

            console.log(input);

            await API.graphql(graphqlOperation(mutations.createContract, {input: input}));
            this.props.history.push('/transports')
        } catch (ex) {
            console.warn("error while creating transport" + JSON.stringify(ex));
            this.setState({
                error: I18n.get("Cannot create transport because validation failed. Please ensure all fields are filled in."),
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

const removeEmpty = obj =>
    Object.keys(obj)
        .filter(k => obj[k])
        .reduce(
            (newObj, k) => ({ ...newObj, [k]: obj[k] }),
            {}
        );

export {
    NewTransport,
    DriverPicker,
    ContactPicker
};