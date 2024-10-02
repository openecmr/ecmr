import {Button, Dropdown, Form, Header, Icon, Modal, Table} from "semantic-ui-react";
import React, {Component} from "react";
import { getCurrentUser } from 'aws-amplify/auth';
import {client} from "./ConsoleUtils";
import {I18n} from 'aws-amplify/utils';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as EmailValidator from "email-validator";

const TextCell = ({text}) => {
    return (
        <Table.Cell verticalAlign="top">{text}</Table.Cell>
    )
};

class AddressPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };

        this.loadAddresses();
    }

    async loadAddresses() {
        const user = await getCurrentUser();
        const response = await client.graphql({query: queries.contactByOwner, variables: {
            limit: 50,
            owner: user.username
        }});
        this.setState({
            options: response.data.contactByOwner.items.map(e => ({text: `${e.name}`, key: e.id, value: e.id})),
            addresses: response.data.contactByOwner.items.reduce((map, obj) => {
                map[obj.id] = obj;
                return map;
            }, {})
        });
    }

    render() {
        return (
            <div style={{marginBottom: '15px'}}>
                <Dropdown
                    placeholder={I18n.get('Select address')}
                    fluid
                    search
                    clearable
                    selection
                    value={this.props.addressId}
                    onChange={(e, data) => {this.props.addressSelected(this.state.addresses[data.value])}}
                    options={this.state.options}
                />
            </div>
        )
    }
}

class AddContactModal extends Component {
    constructor(props) {
        super(props);

        const initialValue = {
            ...props.selectedContact ? this.copyContact(props.selectedContact) : {}
        };

        this.state = {
            contact: initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    copyContact(contact) {
        return {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            contactId: contact.contactId
        };
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
        const { name, phone, email, contactId } = this.state.contact;

        return (<Modal key={"showLoad"} open={this.props.show} size='small'>
            <Header icon={"plus square"} content={I18n.get("Contact")}/>
            <Modal.Content>
                <Form id={"item"}>
                    <Form.Input required error={!!this.state.nameRequired && I18n.get("Required field")} onChange={this.handleChange} label={I18n.get('Name')} type='input' name={"name"} value={name} placeholder={I18n.get("Jack")}/>
                    <Form.Input onChange={this.handleChange} label={I18n.get('Phone')} type='input' name={"phone"} value={phone} placeholder={I18n.get("+1 20 123456")}/>
                    <Form.Input error={!!this.state.emailInvalid && I18n.get("Invalid email address")} onChange={this.handleChange} label={I18n.get('Email')} type='input' name={"email"} value={email} placeholder={I18n.get("jack@company.tld")}/>
                    <Form.Field required error={!!this.state.addressRequired && I18n.get("Required field")}>
                        <label>{I18n.get('Address')}</label>
                        <AddressPicker addressId={contactId}
                                       addressSelected={(address) => this.setState({contact: {
                                               ...this.state.contact,
                                               contactId : address ? address.id : null }})} />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                {!!this.state.contact.id &&
                    <Button color='red' inverted floated={"left"} onClick={() => this.delete()}>
                        <Icon name='user delete'/> {I18n.get('Delete')}
                    </Button>}
                <Button color='blue' inverted onClick={() => this.props.hide()}>
                    <Icon name='cancel'/> {I18n.get('Cancel')}
                </Button>
                <Button color='green' inverted onClick={() => this.add()}>
                    <Icon name='checkmark'/> {this.state.contact.id ? I18n.get('Update contact') : I18n.get('Add contact')}
                </Button>
            </Modal.Actions>
        </Modal>)
    }

    async add() {
        if (!this.validate()) {
            return;
        }

        try {
            if (this.state.contact.id) {
                const response = await client.graphql({query: mutations.updateContactPerson, variables: {input: this.state.contact}});
            } else {
                const response = await client.graphql({query: mutations.createContactPerson, variables: {input: this.state.contact}});
            }
        } catch(ex) {
            console.warn(ex);
            return;
        }
        this.props.hide(true);
    }

    validate() {
        this.setState({
            nameRequired: false,
            emailInvalid: false,
            addressRequired: false
        });
        let result = true;
        if (!this.state.contact.name) {
            this.setState({
                nameRequired: true
            });
            result = false;
        }
        if (this.state.contact.email && !EmailValidator.validate(this.state.contact.email)) {
            this.setState({
                emailInvalid: true
            });
            result = false;
        }
        if (!this.state.contact.contactId) {
            this.setState({
                addressRequired: true
            });
            result = false;
        }
        return result;
    }

    async delete() {
        await client.graphql({query: mutations.deleteContactPerson, variables: {input: {id: this.state.contact.id}}});
        this.props.hide(true);
    }
}

class Contacts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contacts: []
        };
    }

    render() {
        const {selectedContact, showContact} = this.state;

        return ([
            <AddContactModal show={this.state.showContact}
                             hide={(refresh) => {
                                 this.setState({showContact: false});
                                 this.componentDidMount();
                             }}
                             selectedContact={selectedContact}
                             key={showContact}/>,
            <Table className="App-text-with-newlines" selectable compact='very'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell collapsing colSpan='6'>
                            <Button floated='right' icon labelPosition='left' primary size='small'
                                    onClick={() => this.setState({
                                        showContact: true,
                                        newContact: true,
                                        selectedContact: null
                                    })}>
                                <Icon name='plus'/> {I18n.get('New contact')}
                            </Button>

                            <Button floated='right' icon labelPosition='left' primary size='small'
                                    disabled={selectedContact == null}
                                    onClick={() => this.setState({showContact: true, newContact: false})}>
                                <Icon name='edit'/> {I18n.get('Edit contact')}
                            </Button>
                            <Button floated='right' icon labelPosition='left' negative size='small'
                                    disabled={selectedContact == null}
                                    onClick={() => this.deleteContact()}>
                                <Icon name='edit'/> {I18n.get('Delete')}
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell collapsing/>
                        <Table.HeaderCell>{I18n.get('Name')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Phone')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Email')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Address')}</Table.HeaderCell>
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
                    <TextCell text={e.phone}/>
                    <TextCell text={e.email}/>
                    <TextCell text={e.address.name}/>
                </Table.Row>
            )
        )
    }

    handleCheck(contact, checked) {
        this.setState({
            selectedContact: checked ? contact : null
        });
    }

    async deleteContact() {
        await client.graphql({query: mutations.deleteContactPerson, variables: {
            input: {
                id: this.state.selectedContact.id
            }
        }});
        this.setState({
            selectedContact: null
        });
        this.componentDidMount();
    }

    async componentDidMount() {
        const user = await getCurrentUser();
        const response = await client.graphql({query: queries.contactPersonByOwner, variables: {
            limit: 100,
            owner: user.username
        }});
        const contacts = response.data.contactPersonByOwner.items;

        this.setState({
            contacts: contacts,
            selectedContact: this.state.selectedContact && contacts.find(v => v.id === this.state.selectedContact.id)
        });
    }
}

export default Contacts;