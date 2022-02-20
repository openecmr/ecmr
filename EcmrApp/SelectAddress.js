import React, {Component} from "react";
import {SelectList} from "./Components";
import {API, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as queries from "./graphql/queries"

class SelectAddress extends Component {
    constructor(props) {
        super(props);
        const {navigation, route} = props;
        this.state = {
            onSelect: props.route.params.onSelect,
            addresses: []
        };

        this.navigationEventSubscription = this.props.navigation.addListener(
            'focus',
            payload => {
                this.componentDidMount();
            }
        );
        navigation.setOptions({
            title: route.params.label || I18n.get('Select address'),
            headerRight: () => (
                <Button
                    containerStyle={{marginEnd: 10}}
                    onPress={() => {
                        navigation.navigate('AddAddress', {
                            companyOwner: route.params.companyOwner
                        })
                    }}
                    title={I18n.get("New")}
                />
            )
        });
    }

    renderAddress(address) {
        const items = [address.address, address.postalCode, address.city, address.country];
        return items.filter(p => !!p).join(' · ');
    }

    render() {
        return (
            <SelectList data={this.state.addresses}
                        loading={this.state.loading}
                        onSelect={(dataItem) => this.selectAddress(dataItem.item)}
                        onEdit={(dataItem) => this.editAddress(dataItem.item)}
                        emptyLabel={I18n.get('No addresses. Ask your company to add new addresses through the portal.')}
                        renderTitle={(address) => address.item.name}
                        renderSubtitle={(address => this.renderAddress(address.item))}
            />
        )
    }

    selectAddress(address) {
        this.state.onSelect(address);
        this.props.navigation.goBack();
    }

    editAddress(address) {
        const {navigation, route} = this.props;
        navigation.navigate('AddAddress', {
            companyOwner: route.params.companyOwner,
            editAddress: address
        });
    }

    async componentDidMount() {
        this.setState({
            loading: true
        });
        const companyOwner = this.props.route.params.companyOwner;
        const response = await API.graphql(graphqlOperation(queries.contactByOwner, {
            limit: 50,
            owner: companyOwner,
            sortDirection: "ASC"
        }));
        this.setState({
            addresses: response.data.contactByOwner.items,
            loading: false
        });
    }

    componentWillUnmount() {
        this.navigationEventSubscription();
    }
}

export default SelectAddress;