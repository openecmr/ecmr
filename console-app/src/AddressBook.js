import {Button, Form, Header, Icon, Modal, Table} from "semantic-ui-react";
import React, {Component} from "react";
import { getCurrentUser } from 'aws-amplify/auth';
import {I18n} from 'aws-amplify/utils';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import {client} from "./ConsoleUtils";

const TextCell = ({text}) => {
    return (
        <Table.Cell verticalAlign="top">{text}</Table.Cell>
    )
};

class AddAddressModal extends Component {
    constructor(props) {
        super(props);

        const initialValue = {
            ...props.selectedContact ? this.copy(props.selectedContact) : {}
        };

        this.state = {
            contact: initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    copy(contact) {
        const { id, name, address, postalCode, city, country } = contact;
        return { id, name, address, postalCode, city, country }
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
            <Header icon={"plus square"} content={I18n.get("Address")}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input onChange={this.handleChange} label={I18n.get('Name')} type='input' name={"name"} value={name} placeholder={I18n.get("The Trucking Company")}/>
                    <Form.Input onChange={this.handleChange} label={I18n.get('Address')} type='input' name={"address"} value={address} placeholder={I18n.get("22 Oxford street")}/>
                    <Form.Input onChange={this.handleChange} label={I18n.get('Postal code')} type='input' name={"postalCode"} value={postalCode} placeholder={I18n.get("23411")}/>
                    <Form.Input onChange={this.handleChange} label={I18n.get('City')} type='input' name={"city"} value={city} placeholder={I18n.get("London")}/>
                    <Form.Input onChange={this.handleChange} label={I18n.get('Country')} type='input' name={"country"} value={country} placeholder={I18n.get("United Kingdom")}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => this.props.hide()}>
                    <Icon name='remove'/> {I18n.get('Cancel')}
                </Button>
                <Button color='green' inverted onClick={() => this.add()}>
                    <Icon name='checkmark'/> {this.state.contact.id ? I18n.get('Update contact') : I18n.get('Add contact')}
                </Button>
            </Modal.Actions>
        </Modal>)
    }

    async add() {
        try {
            if (this.state.contact.id) {
                const response = await client.graphql({query: mutations.updateContact, variables: {input: this.state.contact}});
            } else {
                const response = await client.graphql({query: mutations.createContact, variables: {input: this.state.contact}});
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
        const {selectedContact, showAddress} = this.state;

        return ([
            <AddAddressModal show={this.state.showAddress}
                             hide={(refresh) => {
                                 this.setState({showAddress: false});
                                 this.componentDidMount();
                             }}
                             selectedContact={selectedContact}
                             key={showAddress}/>,
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
                                <Icon name='plus'/> {I18n.get('New address')}
                            </Button>

                            <Button floated='right' icon labelPosition='left' primary size='small'
                                    disabled={selectedContact == null}
                                    onClick={() => this.setState({showAddress: true, newAddress: false})}>
                                <Icon name='edit'/> {I18n.get('Edit address')}
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell collapsing/>
                        <Table.HeaderCell>{I18n.get('Name')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Address')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Postal code')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('City')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Country')}</Table.HeaderCell>
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
        const user = await getCurrentUser();
        const response = await client.graphql({
            query: queries.contactByOwner, variables: {
                limit: 50,
                owner: user.getUsername()
            }
        });
        const contacts = response.data.contactByOwner.items;

        this.setState({
            contacts: contacts,
            selectedContact: this.state.selectedContact && contacts.find(v => v.id === this.state.selectedContact.id)
        });
    }
}

export default AddressBook;