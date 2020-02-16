import React, {Component} from "react";
import {Button, Dropdown, Form, Header, Icon, Modal, Table} from "semantic-ui-react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";

const TextCell = ({text}) => {
    return (
        <Table.Cell verticalAlign="top"><div style={{textTransform: "capitalize"}}>{text}</div></Table.Cell>
    )
};

const typeOptions = [
    {text: 'truck', value: 'TRUCK'},
    {text: 'trailer', value: 'TRAILER'}
];
const TypeDropdown = ({onChange, value}) =>
    <Dropdown options={typeOptions} clearable={true} fluid
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
            ...props.selectedVehicle ? props.selectedVehicle : {}
        };

        this.state = {
            vehicle: initialValue
        };

        this.handleChange = this.handleChange.bind(this);
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
            <Header icon={"plus square"} content={"Vehicle"}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Field label='Type'
                                name={"type"}
                                control={TypeDropdown}
                                value={type}
                                onChange={this.handleChange}/>
                    <Form.Input onChange={this.handleChange} label='License plate number' type='input' name={"licensePlateNumber"} value={licensePlateNumber} placeholder={"License plate number"}/>
                    <Form.Input onChange={this.handleChange} label='Description' type='input' name={"description"} value={description} placeholder={"Description"}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => this.props.hide()}>
                    <Icon name='remove'/> Cancel
                </Button>
                <Button color='green' inverted onClick={() => this.add()}>
                    <Icon name='checkmark'/> {this.state.vehicle.id ? 'Update vehicle' : 'Add vehicle'}
                </Button>
            </Modal.Actions>
        </Modal>)
    }

    async add() {
        try {
            if (this.state.vehicle.id) {
                const response = await API.graphql(graphqlOperation(mutations.updateVehicle, {input: this.state.vehicle}));
            } else {
                let vehicle = {
                    ...this.state.vehicle,
                    companyId: this.props.company.id
                };
                console.warn(vehicle);
                const response = await API.graphql(graphqlOperation(mutations.createVehicle, {
                    input: vehicle
                }));
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
            showAddDriver: false,
            vehicles: []
        };
    }

    render() {
        const {selectedVehicle} = this.state;

        return ([
            <AddVehicleModal show={this.state.showAddVehicle}
                             hide={(refresh) => {
                                 this.setState({showAddVehicle: false});
                                 this.componentDidMount();
                             }}
                             company={this.props.company}
                             selectedVehicle={selectedVehicle}
                             key={selectedVehicle ? selectedVehicle.id : null}/>,
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
                            <Icon name='plus'/> New vehicle
                        </Button>

                        <Button floated='right' icon labelPosition='left' primary size='small'
                                disabled={selectedVehicle == null}
                                onClick={() => this.setState({showAddVehicle: true, newVehicle: false})}>
                            <Icon name='edit'/> Edit vehicle
                        </Button>

                        <Button floated='right' icon labelPosition='left' primary size='small'
                                disabled={selectedVehicle == null}
                                onClick={() => this.deleteVehicle()}>
                            <Icon name='edit'/> Delete vehicle
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell collapsing/>
                    <Table.HeaderCell>License plate number</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
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
                    <TextCell text={e.type.toLowerCase()}/>
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
        await API.graphql(graphqlOperation(mutations.deleteDriver, {
            input: {
                id: this.state.selectedVehicle.id
            }
        }));
        this.setState({
            selectedVehicle: null
        });
        this.componentDidMount();
    }

    async componentDidMount() {
        const user = await Auth.currentAuthenticatedUser();
        const response = await API.graphql(graphqlOperation(queries.listVehicles, {
            limit: 1000,
            filter: {
                "owner": {
                    "eq": user.getUsername()
                }
            }
        }));
        const vehicles = response.data.listVehicles.items;

        this.setState({
            vehicles: vehicles
        });
    }
}

export default Vehicles;