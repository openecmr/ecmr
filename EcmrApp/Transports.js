import {Component} from "react";
import {SectionList, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React from "react";
import * as queries from "./graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';

class Transports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contracts: [],
            sortedContracts: []
        };
    }

    static Address = ({address}) => (
        <View style={{flex: 1, flexDirection: 'row'}}>
            <Icon name="location-arrow" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
            <View style={{flex: 8}}>
                <Text>{address.postalCode} {address.city} {address.country}</Text>
                <Text>{address.address}</Text>
                <Text>{address.name}</Text>
            </View>
        </View>
    );

    renderItem(item) {
        const total = item.loads.reduce((acc, load) => acc + (load.quantity ? Number(load.quantity) : 0), 0);

        return (
            <TouchableOpacity onPress={() => this.open(item)}>
                <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white', elevation: 5, marginBottom: 10}}>
                    <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'powderblue', paddingTop: 10, paddingBottom: 10}}>
                        <Text style={{flex: 2, fontWeight: 'bold', paddingRight: 5, paddingLeft: 5, paddingTop: 5, paddingBottom: 5}}>TRANSPORT {item.id.substring(0, 8)}</Text>
                        <Text style={{flex: 1, textAlign: 'center', color: 'white', fontWeight: 'bold', right: 5, paddingRight: 5, paddingLeft: 5, paddingTop: 5, paddingBottom: 5, borderRadius: 15, backgroundColor: 'rgb(60, 167, 60)'}}>loading complete</Text>
                    </View>
                    <View style={{flex: 1, padding: 5, paddingLeft: 10, paddingRight: 10, elevation: 1, marginBottom: 5, backgroundColor: 'white'}}>
                        <Text style={{fontWeight: 'bold'}}>pickup</Text>
                        <Transports.Address address={item.pickup}/>

                        <View style={{flex: 1, flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>
                            <Icon name="dropbox" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
                            <Text style={{flex: 8}}>{total} packages</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, padding: 5, paddingLeft: 10, paddingRight: 10}}>
                        <Text style={{fontWeight: 'bold', paddingTop: 10}}>delivery</Text>
                        <Transports.Address address={item.delivery}/>
                        <View style={{flex: 1, flexDirection: 'row', paddingTop: 10}}>
                            <Icon name="dropbox" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
                            <Text style={{flex: 8}}>{total} packages</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    open(item) {
        const {navigate} = this.props.navigation;
        navigate('Transport', {
            id: item.id
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    sections={this.state.sortedContracts}
                    renderItem={({item}) => this.renderItem(item)}
                    renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title ? section.title : "unknown date"}</Text>}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }

    async componentDidMount() {
        const response = await API.graphql(graphqlOperation(queries.listContracts));
        const contracts = response.data.listContracts.items.sort((a, b) => a.arrivalDate < b.arrivalDate ? 1 : -1);
        const groupedContracts = contracts.reduce((acc, contract) => {
            const arrivalDate = contract.arrivalDate;
            if (acc[arrivalDate]) {
                acc[arrivalDate].data.push(contract);
            } else {
                acc[arrivalDate] = {
                    title: arrivalDate,
                    data: [contract]
                };
            }
            return acc;
        }, {});
        const sortedContracts = Array.from(Object.values(groupedContracts));

        this.setState({
            contracts: contracts,
            sortedContracts: sortedContracts
        });
    }
}

export default Transports;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionHeader: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});