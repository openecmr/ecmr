import {Button, Form, Header, Icon, Modal, Table} from "semantic-ui-react";
import React, {Component} from "react";
import {API, graphqlOperation} from "aws-amplify";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";

const TextCell = ({text}) => {
    return (
        <Table.Cell verticalAlign="top">{text}</Table.Cell>
    )
};

class AddAddressModal extends Component {
    constructor(props) {
        super(props);

        const initialValue = {
            ...props.selectedContact ? props.selectedContact : {}
        };

        this.state = {
            contact: initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e, { name, value }) {
        this.setState({
            contact: {
                ...this.state.contact,
                [name]: value
            }
        });
    }

    render() {
        const { name, address, postalCode, city, country } = this.state.contact;

        return (<Modal key={"showLoad"} open={this.props.show} size='small'>
            <Header icon={"plus square"} content={"Address"}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input onChange={this.handleChange} label='Name' type='input' name={"name"} value={name} placeholder={"The Trucking Company"}/>
                    <Form.Input onChange={this.handleChange} label='Address' type='input' name={"address"} value={address} placeholder={"22 Oxford street"}/>
                    <Form.Input onChange={this.handleChange} label='Postal code' type='input' name={"postalCode"} value={postalCode} placeholder={"23411"}/>
                    <Form.Input onChange={this.handleChange} label='City' type='input' name={"city"} value={city} placeholder={"London"}/>
                    <Form.Input onChange={this.handleChange} label='Country' type='input' name={"country"} value={country} placeholder={"United Kingdom"}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => this.props.hide()}>
                    <Icon name='remove'/> Cancel
                </Button>
                <Button color='green' inverted onClick={() => this.add()}>
                    <Icon name='checkmark'/> {this.state.contact.id ? 'Update contact' : 'Add contact'}
                </Button>
            </Modal.Actions>
        </Modal>)
    }

    async add() {
        try {
            if (this.state.contact.id) {
                const response = await API.graphql(graphqlOperation(mutations.updateContact, {input: this.state.contact}));
            } else {
                const response = await API.graphql(graphqlOperation(mutations.createContact, {input: this.state.contact}));
            }
        } catch(ex) {
            console.warn(ex);
            return;
        }
        this.props.hide(true);
    }
}

class AddressBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contacts: []
        };
    }

    render() {
        const {selectedContact} = this.state;

        return ([
            <AddAddressModal show={this.state.showAddress}
                             hide={(refresh) => {
                                 this.setState({showAddress: false});
                                 this.componentDidMount();
                             }}
                             selectedContact={selectedContact}
                             key={selectedContact ? selectedContact.id : null}/>,
            <Table className="App-text-with-newlines" selectable compact='very'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell collapsing colSpan='6'>

                            <Button floated='right' icon labelPosition='left' primary size='small'
                                    onClick={() => this.setState({
                                        showAddress: true,
                                        newAddress: true,
                                        selectedContact: null
                                    })}>
                                <Icon name='plus'/> New contact
                            </Button>

                            <Button floated='right' icon labelPosition='left' primary size='small'
                                    disabled={selectedContact == null}
                                    onClick={() => this.setState({showAddress: true, newAddress: false})}>
                                <Icon name='edit'/> Edit contact
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell collapsing/>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Postal code</Table.HeaderCell>
                        <Table.HeaderCell>City</Table.HeaderCell>
                        <Table.HeaderCell>Country</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.renderContacts()}
                </Table.Body>
            </Table>
        ]);
    }

    renderContacts() {
        const selectedContactId = this.state.selectedContact ? this.state.selectedContact.id : null;

        return (
            this.state.contacts.map((e) =>
                <Table.Row key={e.id}>
                    <Table.Cell collapsing verticalAlign="top">
                        <Form.Checkbox checked={e.id === selectedContactId}
                                       onChange={(event, {checked}) => this.handleCheck(e, checked)}/>
                    </Table.Cell>
                    <TextCell text={e.name}/>
                    <TextCell text={e.address}/>
                    <TextCell text={e.postalCode}/>
                    <TextCell text={e.city}/>
                    <TextCell text={e.country}/>
                </Table.Row>
            )
        )
    }

    handleCheck(contact, checked) {
        this.setState({
            selectedContact: checked ? contact : null
        });
    }

    async componentDidMount() {
        const response = await API.graphql(graphqlOperation(queries.listContacts, {
            limit: 1000
        }));
        const contacts = response.data.listContacts.items;

        this.setState({
            contacts: contacts
        });
    }
}

export default AddressBook;