import React, {Component} from "react";
import {Button, Dropdown, Form, Header, Icon, Modal, Table} from "semantic-ui-react";
import { getCurrentUser } from 'aws-amplify/auth';
import {client} from "./ConsoleUtils";
import {I18n} from 'aws-amplify/utils';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";

const TextCell = ({text}) => {
    return (
        <Table.Cell verticalAlign="top"><div style={{textTransform: "capitalize"}}>{text}</div></Table.Cell>
    )
};

const typeOptions = () => [
    {text: I18n.get('truck'), value: 'TRUCK'},
    {text: I18n.get('trailer'), value: 'TRAILER'}
];
const TypeDropdown = ({onChange, value}) =>
    <Dropdown options={typeOptions()} clearable={true} fluid
        // onChange={(e, data) => {onChange(data.value)}}
              onChange={(e, data) => onChange(e, {
                  name: "type",
                  value: data.value
              })}
              value={value} search
              selection/>;

class AddVehicleModal extends Component {
    constructor(props) {
        super(props);

        const initialValue = {
            ...props.selectedVehicle ? this.copy(props.selectedVehicle) : {}
        };

        this.state = {
            vehicle: initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    copy(vehicle) {
        const { id, licensePlateNumber, type, description } = vehicle;
        return { id, licensePlateNumber, type, description };
    }

    handleChange(e, { name, value }) {
        this.setState({
            vehicle: {
                ...this.state.vehicle,
                [name]: value
            }
        });
    }

    render() {
        const { licensePlateNumber, type, description } = this.state.vehicle;

        return (<Modal key={"showLoad"} open={this.props.show} size='small'>
            <Header icon={"plus square"} content={I18n.get("Vehicle")}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Field label={I18n.get('Type')}
                                name={"type"}
                                control={TypeDropdown}
                                value={type}
                                onChange={this.handleChange}/>
                    <Form.Input onChange={this.handleChange} label={I18n.get('License plate number')} type='input' name={"licensePlateNumber"} value={licensePlateNumber}
                                placeholder={I18n.get("License plate number")}/>
                    <Form.Input onChange={this.handleChange} label={I18n.get('Description')} type='input' name={"description"} value={description}
                                placeholder={I18n.get("Description")}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => this.props.hide()}>
                    <Icon name='remove'/> {I18n.get('Cancel')}
                </Button>
                <Button color='green' inverted onClick={() => this.add()}>
                    <Icon name='checkmark'/> {this.state.vehicle.id ? I18n.get('Update vehicle') : I18n.get('Add vehicle')}
                </Button>
            </Modal.Actions>
        </Modal>)
    }

    async add() {
        try {
            if (this.state.vehicle.id) {
                const response = await client.graphql({query: mutations.updateVehicle, variables: {input: this.state.vehicle}});
            } else {
                let vehicle = {
                    ...this.state.vehicle,
                    companyId: this.props.company.id
                };
                console.warn(vehicle);
                const response = await client.graphql({query: mutations.createVehicle, variables: {
                    input: vehicle
                }});
            }
        } catch(ex) {
            console.warn(ex);
            return;
        }
        this.props.hide(true);
    }
}

class Vehicles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddVehicle: false,
            vehicles: []
        };
    }

    render() {
        const {selectedVehicle, showAddVehicle} = this.state;

        return ([
            <AddVehicleModal show={this.state.showAddVehicle}
                             hide={(refresh) => {
                                 this.setState({showAddVehicle: false});
                                 this.componentDidMount();
                             }}
                             company={this.props.company}
                             selectedVehicle={selectedVehicle}
                             key={showAddVehicle}/>,
            <Table className="App-text-with-newlines" selectable compact='very'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell collapsing colSpan='4'>

                        <Button floated='right' icon labelPosition='left' primary size='small'
                                onClick={() => this.setState({
                                    showAddVehicle: true,
                                    newVehicle: true,
                                    selectedVehicle: null
                                })}>
                            <Icon name='plus'/> {I18n.get('New vehicle')}
                        </Button>

                        <Button floated='right' icon labelPosition='left' primary size='small'
                                disabled={!selectedVehicle}
                                onClick={() => this.setState({showAddVehicle: true, newVehicle: false})}>
                            <Icon name='edit'/> {I18n.get('Edit vehicle')}
                        </Button>

                        <Button floated='right' icon labelPosition='left' negative size='small'
                                disabled={!selectedVehicle}
                                onClick={() => this.deleteVehicle()}>
                            <Icon name='edit'/> {I18n.get('Delete')}
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell collapsing/>
                    <Table.HeaderCell>{I18n.get('License plate number')}</Table.HeaderCell>
                    <Table.HeaderCell>{I18n.get('Type')}</Table.HeaderCell>
                    <Table.HeaderCell>{I18n.get('Description')}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {this.renderVehicles()}
            </Table.Body>
        </Table>]);
    }

    renderVehicles() {
        const selectedVehicleId = this.state.selectedVehicle ? this.state.selectedVehicle.id : null;

        return (
            this.state.vehicles.map((e) =>
                <Table.Row key={e.id}>
                    <Table.Cell collapsing verticalAlign="top">
                        <Form.Checkbox checked={e.id === selectedVehicleId}
                                       onChange={(event, {checked}) => this.handleCheck(e, checked)}/>
                    </Table.Cell>
                    <TextCell text={e.licensePlateNumber}/>
                    <TextCell text={I18n.get(e.type.toLowerCase())}/>
                    <TextCell text={e.description}/>
                </Table.Row>
            )
        )
    }

    handleCheck(vehicle, checked) {
        this.setState({
            selectedVehicle: checked ? vehicle : null
        });
    }

    async deleteVehicle() {
        await client.graphql({query: mutations.deleteVehicle, variables: {
            input: {
                id: this.state.selectedVehicle.id
            }
        }});
        this.setState({
            selectedVehicle: null
        });
        this.componentDidMount();
    }

    async componentDidMount() {
        const user = await getCurrentUser();
        const response = await client.graphql({query: queries.vehicleByOwner, variables: {
            limit: 50,
            owner: user.username
        }});
        const vehicles = response.data.vehicleByOwner.items;

        this.setState({
            vehicles: vehicles,
            selectedVehicle: this.state.selectedVehicle && vehicles.find(v => v.id === this.state.selectedVehicle.id),
        });
    }
}

export default Vehicles;