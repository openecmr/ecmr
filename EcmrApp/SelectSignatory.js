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
                <MyText style={{fontSize: 11}}>{addressName}</MyText>
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
                title="Add"
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
            <View>
                {false && <View style={{flexDirection: "row", alignItems: "center", backgroundColor: 'white', padding: 10, marginTop: 10}}>
                    <Icon size={20} name={"search"}/>
                    <TextInput
                        value={this.signatoryName}
                        style={{...styles.textInput, flex: 1, marginLeft: 10}}
                        placeholder={I18n.get("e.g. John Smith...")}
                        onChangeText={(signatoryName) => this.setState({signatoryName})}/>
                </View>}

                <FlatList renderItem={(contact) => <ContactItem onSelect={() => this.selectContact(contact.item)}
                                                                contact={contact} addressName={address}/>}
                          keyExtractor={(item) => item.id}
                          data={this.state.contacts}
                          style={{marginTop: 5}}

                />
            </View>
        )
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
            contacts: response.data.contactPersonByContact.items
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