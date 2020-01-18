import React, {Component} from "react";
import {Button, Form, Header, Icon, Modal, Table} from "semantic-ui-react";
import {API, graphqlOperation} from "aws-amplify";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";

const TextCell = ({text}) => {
    return (
        <Table.Cell verticalAlign="top">{text}</Table.Cell>
    )
};

class AddDriverModal extends Component {
    constructor(props) {
        super(props);

        const initialValue = {
            ...props.selectedDriver ? props.selectedDriver : {}
        };

        this.state = {
            driver: initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e, { name, value }) {
        this.setState({
            driver: {
                ...this.state.driver,
                [name]: value
            }
        });
    }

    render() {
        const { name, address } = this.state.driver;

        return (<Modal key={"showLoad"} open={this.props.show} size='small'>
            <Header icon={"plus square"} content={"Add address"}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input onChange={this.handleChange} label='Name' type='input' name={"name"} value={name} placeholder={"Name of driver"}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => this.props.hide()}>
                    <Icon name='remove'/> Cancel
                </Button>
                <Button color='green' inverted onClick={() => this.add()}>
                    <Icon name='checkmark'/> {this.state.driver.id ? 'Update driver' : 'Add driver'}
                </Button>
            </Modal.Actions>
        </Modal>)
    }

    async add() {
        try {
            if (this.state.driver.id) {
                const response = await API.graphql(graphqlOperation(mutations.updateDriver, {input: this.state.driver}));
            } else {
                const random = new Uint8Array(6);
                window.crypto.getRandomValues(random);
                let associationSecret = "";
                for (let i = 0; i < random.length; i++) {
                    associationSecret += String.fromCharCode(64 + (random[i] % 26) + 1);
                }
                const response = await API.graphql(graphqlOperation(mutations.createDriver, {input: {
                        ...this.state.driver,
                        associationSecret
                    }
                }));
            }
        } catch(ex) {
            console.warn(ex);
            return;
        }
        this.props.hide(true);
    }
}

class Drivers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddDriver: false,
            drivers: []
        };
    }

    render() {
        const {selectedDriver} = this.state;

        return ([
            <AddDriverModal show={this.state.showAddDriver}
                             hide={(refresh) => {
                                 this.setState({showAddDriver: false});
                                 this.componentDidMount();
                             }}
                             selectedDriver={selectedDriver}
                             key={selectedDriver ? selectedDriver.id : null}/>,
            <Table className="App-text-with-newlines" selectable compact='very'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell collapsing colSpan='4'>

                        <Button floated='right' icon labelPosition='left' primary size='small'
                                onClick={() => this.setState({
                                    showAddDriver: true,
                                    newDriver: true,
                                    selectedDriver: null
                                })}>
                            <Icon name='plus'/> New driver
                        </Button>

                        <Button floated='right' icon labelPosition='left' primary size='small'
                                disabled={selectedDriver == null}
                                onClick={() => this.setState({showAddDriver: true, newDriver: false})}>
                            <Icon name='edit'/> Edit driver
                        </Button>

                        <Button floated='right' icon labelPosition='left' primary size='small'
                                disabled={selectedDriver == null}
                                onClick={() => this.deleteDriver()}>
                            <Icon name='edit'/> Delete driver
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell collapsing/>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Linked account</Table.HeaderCell>
                    <Table.HeaderCell>Association secret</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {this.renderDrivers()}
            </Table.Body>
        </Table>]);
    }

    renderDrivers() {
        const selectedDriverId = this.state.selectedDriver ? this.state.selectedDriver.id : null;

        return (
            this.state.drivers.map((e) =>
                <Table.Row key={e.id}>
                    <Table.Cell collapsing verticalAlign="top">
                        <Form.Checkbox checked={e.id === selectedDriverId}
                                       onChange={(event, {checked}) => this.handleCheck(e, checked)}/>
                    </Table.Cell>
                    <TextCell text={e.name}/>
                    <TextCell text={e.carrier}/>
                    <TextCell text={e.associationSecret}/>
                </Table.Row>
            )
        )
    }

    handleCheck(contact, checked) {
        this.setState({
            selectedDriver: checked ? contact : null
        });
    }

    async deleteDriver() {
        await API.graphql(graphqlOperation(mutations.deleteDriver, {
            input: {
                id: this.state.selectedDriver.id
            }
        }));
        this.setState({
           selectedDriver: null
        });
        this.componentDidMount();
    }

    async componentDidMount() {
        const response = await API.graphql(graphqlOperation(queries.listDrivers, {
            limit: 1000
        }));
        const drivers = response.data.listDrivers.items;

        this.setState({
            drivers: drivers
        });
    }
}

export default Drivers;