import React, {Component} from "react";
import {FlatList, Image, ListView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {MyText} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as customQueries from "./graphql/custom-queries"

const ContactItem = ({contact, addressName, onSelect}) =>
    <TouchableOpacity onPress={onSelect}>
        <View style={{
            flexDirection: "row",
            backgroundColor: 'white',
            padding: 10,
            borderBottomColor: 'rgb(246, 246, 246)',
            borderBottomWidth: 2
        }}>
            <Icon size={30} style={{color: 'rgb(111, 111, 111)'}} name={"user-alt"}/>
            <View style={{marginLeft: 10}}>
                <MyText style={{fontWeight: "bold"}}>{contact.item.name}</MyText>
                <MyText style={{fontSize: 11}}>{addressName}{!!contact.item.email && ` · ${contact.item.email}`}</MyText>
            </View>
        </View>
    </TouchableOpacity>;

class SelectSignatory extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: I18n.get('Select signatory'),
        headerRight: () => (
            <Button
                containerStyle={{marginEnd: 10}}
                onPress={() => {
                    const site = navigation.getParam('site');
                    const item = navigation.getParam('item');
                    const addressId = item[site + "ContactId"];
                    const addressName = item[site].name;
                    const {owner, driverDriverId} = item;
                    navigation.navigate('AddContact', {
                        addressId,
                        addressName,
                        owner,
                        driverDriverId
                    })
                }}
                title={I18n.get("New")}
            />
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site")
        };
        this.navigationEventSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                this.componentDidMount();
            }
        );
    }

    render() {
        const address = this.state.contract[this.state.site].name;
        return (
            <View style={{flex: 1}}>
                <FlatList renderItem={(contact) => <ContactItem onSelect={() => this.selectContact(contact.item)}
                                                                contact={contact} addressName={address}/>}
                          keyExtractor={(item) => item.id}
                          data={this.state.contacts}
                          style={{marginTop: 5, marginBottom: 70}}
                          ListEmptyComponent={<MyText style={{fontWeight: "bold", padding: 20, textAlign: "center"}}>No contacts for this address. Add a contact or choose manual entry.</MyText>}

                />
                <Button containerStyle={{position: "absolute", start: 10, bottom: 10, end: 10}} title={I18n.get("Manual entry")}
                        buttonStyle={{height: 50}}
                        onPress={() => this.skip()}/>
            </View>
        )
    }

    skip() {
        const {navigate} = this.props.navigation;
        navigate('SignatoryInformation', {
            item: this.state.contract,
            site: this.state.site,
            photos: this.props.navigation.getParam("photos")
        });
    }

    selectContact(contact) {
        const {navigate} = this.props.navigation;
        navigate('Signature', {
            item: this.state.contract,
            site: this.state.site,
            signatoryEmail: contact.email,
            signatoryName: contact.name,
            photos: this.props.navigation.getParam("photos")
        });
    }

    async componentDidMount() {
        this.setState({
            loading: true
        });
        const contactId = this.state.contract[this.state.site + "ContactId"];
        if (!contactId) {
            return;
        }
        const response = await API.graphql(graphqlOperation(customQueries.contactPersonByContact, {
            limit: 50,
            contactId: contactId,
            sortDirection: "ASC"
        }));
        this.setState({
            contacts: response.data.contactPersonByContact.items,
            loading: false
        });
    }

    componentWillUnmount() {
        this.navigationEventSubscription.remove();
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    baseContainer: {
        flex: 1, padding: 10
    },
});

export default SelectSignatory;