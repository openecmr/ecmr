import React, {Component} from "react";
import {FlatList, Image, ListView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {MyText, SelectList} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as customQueries from "./graphql/custom-queries"
import * as queries from "./graphql/queries"

class SelectAddress extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.getParam("label") || I18n.get('Select address'),
        // headerRight: () => (
        //     <Button
        //         containerStyle={{marginEnd: 10}}
        //         onPress={() => {
        //             const site = navigation.getParam('site');
        //             const item = navigation.getParam('item');
        //             const addressId = item[site + "ContactId"];
        //             const addressName = item[site].name;
        //             const {owner, driverDriverId} = item;
        //             navigation.navigate('AddContact', {
        //                 addressId,
        //                 addressName,
        //                 owner,
        //                 driverDriverId
        //             })
        //         }}
        //         title={I18n.get("New")}
        //     />
        // )
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
            <SelectList data={this.state.addresses}
                        onSelect={(dataItem) => this.selectAddress(dataItem.item)}
                        emptyLabel={I18n.get("No addresses. Add an address or choose manual entry.")}
                        renderTitle={(address) => address.item.name}
                        renderSubtitle={(address=> `${address.item.address}${!!address.item.city && ` · ${address.item.city}`}`)}
            />
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

export default SelectAddress;