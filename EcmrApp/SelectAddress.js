import React, {Component} from "react";
import {FlatList, Image, ListView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {MyText} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as customQueries from "./graphql/custom-queries"
import * as queries from "./graphql/queries"

const AddressItem = ({address, onSelect}) =>
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
                <MyText style={{fontWeight: "bold"}}>{address.item.name}</MyText>
                <MyText style={{fontSize: 11}}>{address.item.address}{!!address.item.city && ` · ${address.item.city}`}</MyText>
            </View>
        </View>
    </TouchableOpacity>;

class SelectAddress extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: I18n.get('Select address'),
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
            onSelect: props.navigation.getParam("onSelect"),
            addresses: []
        };
        this.navigationEventSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                this.componentDidMount();
            }
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList renderItem={(address) => <AddressItem onSelect={() => this.selectAddress(address.item)}
                                                                address={address} />}
                          keyExtractor={(item) => item.id}
                          data={this.state.addresses}
                          style={{marginTop: 5, marginBottom: 70}}
                          ListEmptyComponent={<MyText style={{fontWeight: "bold", padding: 20, textAlign: "center"}}>
                              {I18n.get("No addresses. Add an address or choose manual entry.")}</MyText>}

                />
            </View>
        )
    }

    selectAddress(address) {
        this.state.onSelect(address);
        this.props.navigation.goBack();
    }

    async componentDidMount() {
        this.setState({
            loading: true
        });
        const user = (await Auth.currentAuthenticatedUser()).getUsername();
        const response = await API.graphql(graphqlOperation(queries.contactByOwner, {
            limit: 50,
            owner: user,
            sortDirection: "ASC"
        }));
        this.setState({
            addresses: response.data.contactByOwner.items,
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

export default SelectAddress;