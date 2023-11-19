import React, {Component} from "react";
import {Button, Form, Header, Icon, List, Modal, Popup, Table} from "semantic-ui-react";
import {API, Auth, graphqlOperation} from "aws-amplify";
import {I18n} from 'aws-amplify/utils';
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
            {I18n.get('In order for a driver to activate an account he needs to install the Open e-CMR app, create an account and link the account using this secret code.')}{' '}
            {I18n.get('The steps for the driver are:')}
            <List bulleted>
                <List.Item>{I18n.get('Install the Open e-CMR app')}
                    <List.List>
                        <List.Item href='https://play.google.com/store/apps/details?id=com.ecmrapp'>{I18n.get('Search for open ecmr in Google Play')}</List.Item>
                    </List.List>
                </List.Item>
                <List.Item>{I18n.get('Create an account (the easiest way is to use Google sign in)')}
                </List.Item>
                <List.Item>{I18n.get('Go to ')}<em>{I18n.get('Settings')} &gt; {I18n.get('Link to company')}</em> {I18n.get('and enter the secret code')}</List.Item>
            </List>
            {I18n.get('After activation the secret code will disappear and the account name will be filled in.')}
        </div>}
        header={I18n.get("Activating an account")}
        trigger={<div style={{textDecoration: "underline"}}>{associationSecret}</div>}
    /></Table.Cell>

class AddDriverModal extends Component {
    constructor(props) {
        super(props);

        const initialValue = {
            ...props.selectedDriver ? this.copy(props.selectedDriver) : {}
        };

        this.state = {
            driver: initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    copy(driver) {
        const { id, name } = driver;
        return { id, name };
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
        const { name } = this.state.driver;

        return (<Modal key={"showLoad"} open={this.props.show} size='small'>
            <Header icon={"plus square"} content={I18n.get('Driver')}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input onChange={this.handleChange} label={I18n.get('Name')} type='input' name={"name"}
                                value={name} placeholder={I18n.get('Name of driver')}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => this.props.hide()}>
                    <Icon name='remove'/> {I18n.get('Cancel')}
                </Button>
                <Button color='green' inverted onClick={() => this.add()}>
                    <Icon name='checkmark'/> {this.state.driver.id ? I18n.get('Update driver') : I18n.get('Add driver')}
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
        const {selectedDriver, showAddDriver} = this.state;

        return ([
            <AddDriverModal show={this.state.showAddDriver}
                             hide={(refresh) => {
                                 this.setState({showAddDriver: false});
                                 this.componentDidMount();
                             }}
                             selectedDriver={selectedDriver}
                             key={showAddDriver}/>,
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
                            <Icon name='plus'/> {I18n.get('New driver')}
                        </Button>

                        <Button floated='right' icon labelPosition='left' primary size='small'
                                disabled={selectedDriver == null}
                                onClick={() => this.setState({showAddDriver: true, newDriver: false})}>
                            <Icon name='edit'/> {I18n.get('Edit driver')}
                        </Button>

                        <Button floated='right' icon labelPosition='left' negative size='small'
                                disabled={selectedDriver == null}
                                onClick={() => this.deleteDriver()}>
                            <Icon name='edit'/> {I18n.get('Delete')}
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell collapsing/>
                    <Table.HeaderCell>{I18n.get('Name')}</Table.HeaderCell>
                    <Table.HeaderCell>{I18n.get('Linked account')}</Table.HeaderCell>
                    <Table.HeaderCell>{I18n.get('Association secret')}</Table.HeaderCell>
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
        const response = await API.graphql(graphqlOperation(queries.driverByOwner, {
            limit: 50,
            owner: user.getUsername()
        }));
        const drivers = response.data.driverByOwner.items;

        this.setState({
            drivers: drivers,
            selectedDriver: this.state.selectedDriver && drivers.find(v => v.id === this.state.selectedDriver.id),
        });
    }
}

export default Drivers;