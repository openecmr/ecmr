import React, {Component} from "react";
import {Button, Form, Header, Icon, Image, List, Modal, Popup, Table} from "semantic-ui-react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as ConsoleUtils from "./ConsoleUtils";

const TextCell = ({text}) => {
    return (
        <Table.Cell verticalAlign="top">{text}</Table.Cell>
    )
};

const AssociationSecretCell = ({associationSecret}) =>
    <Table.Cell style={{...(!!associationSecret && {cursor: "pointer"})}}><Popup

        on='click'
        content={<div>
            In order for a driver to activate an account he needs to install the Open e-CMR app, create an account and link the account using this secret code.
            The steps for the driver are:
            <List bulleted>
                <List.Item>Install the Open e-CMR app
                    <List.List>
                        <List.Item href='https://play.google.com/store/apps/details?id=com.ecmrapp'>Search for open ecmr in Google Play</List.Item>
                    </List.List>
                </List.Item>
                <List.Item>Create an account (the easiest way is to use Google sign in)
                </List.Item>
                <List.Item>Go to <em>Settings &gt; Link to company</em> and enter the secret code</List.Item>
            </List>
            After activation the secret code will disappear and the account name will be filled in.
        </div>}
        header={"Activating an account"}
        trigger={<div style={{textDecoration: "underline"}}>{associationSecret}</div>}
    /></Table.Cell>

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
            <Header icon={"plus square"} content={"Driver"}/>
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
                let associationSecret = ConsoleUtils.generateAssociationSecret();
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
                    <AssociationSecretCell associationSecret={e.associationSecret}/>
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
        const user = await Auth.currentAuthenticatedUser();
        const response = await API.graphql(graphqlOperation(queries.listDrivers, {
            limit: 1000,
            filter: {
                "owner": {
                    "eq": user.getUsername()
                }
            }
        }));
        const drivers = response.data.listDrivers.items;

        this.setState({
            drivers: drivers
        });
    }
}

export default Drivers;