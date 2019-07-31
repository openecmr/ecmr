import {Component} from "react";
import {SectionList, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import React from "react";
import * as queries from "./graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';
import {MyText, Address, Packages} from './Components';

class Transports extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Open e-CMR'
    });

    constructor(props) {
        super(props);

        this.state = {
            contracts: [],
            sortedContracts: [],
            refreshing: false
        };
    }

    renderItem(item) {
        const total = item.loads.reduce((acc, load) => acc + (load.quantity ? load.quantity : 0), 0);

        return (
            <View style={styles.card}>
                <View style={styles.transportCardHeader}>
                    <MyText style={styles.transportCardHeaderId}>TRANSPORT {item.id.substring(0, 8)}</MyText>
                    <MyText style={styles.transportCardHeaderProgress}>{this.progressText(item)}</MyText>
                </View>
                <TouchableOpacity onPress={() => this.open(item, 'pickup')}>
                    <View style={styles.transportCardPart}>
                        <MyText style={styles.upperCaseLabel}>pickup</MyText>
                        <Address address={item.pickup}/>
                        <Packages total={total}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.open(item, 'delivery')}>
                    <View style={styles.transportCardPart}>
                        <MyText style={styles.upperCaseLabel}>delivery</MyText>
                        <Address address={item.delivery}/>
                        <Packages total={total}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    open(item, site) {
        const {navigate} = this.props.navigation;
        navigate('Transport', {
            item: item,
            site: site
        });
    }

    progressText(item) {
        const labels = {
            Acknowledged: "acknowledged",
            ArrivalOnSite: "arrived on site",
            LoadingComplete: "loading complete"
        };
        const actions = ['Acknowledged', 'ArrivalOnSite', 'LoadingComplete', /*'DepartureFromSite'*/];
        const events = (item.events || []).filter(e => e.site === "pickup" && actions.indexOf(e.type) !== -1).map(e => e.type);
        const state = events.length === 0 ? actions[0] : events[events.length - 1];
        return labels[state];
    }

    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.refreshing}
                    sections={this.state.sortedContracts}
                    renderItem={({item}) => this.renderItem(item)}
                    renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title ? section.title : "unknown date"}</Text>}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }

    async onRefresh() {
        this.setState({
            refreshing: true
        });
        await this.componentDidMount();
        this.setState({
            refreshing: false
        });
    }

    async componentDidMount() {
        const response = await API.graphql(graphqlOperation(queries.listContracts));
        const contracts = response.data.listContracts.items.sort((a, b) => {
            const first = (a.arrivalDate || "").localeCompare(b.arrivalDate || "");
            if (first === 0) {
                return a.createdAt.localeCompare(b.createdAt);
            } else {
                return first;
            }
        });
        contracts.reverse();
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
        elevation: 2,
        color: 'black'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    card: {
        backgroundColor: 'white',
        elevation: 5,
        marginBottom: 10
    },
    transportCardHeader: {
        flexDirection: 'row',
        backgroundColor: 'rgb(225,236,254)',
        paddingTop: 10,
        paddingBottom: 10
    },
    transportCardHeaderId: {
        flex: 2,
        fontWeight: 'bold',
        paddingRight: 5,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    transportCardHeaderProgress: {
        flex: 1,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        right: 10,
        borderRadius: 15,
        backgroundColor: 'rgb(60, 167, 60)',

        paddingRight: 5,
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    transportCardPart: {
        flex: 1,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 1,
        backgroundColor: 'white'
    },
    upperCaseLabel: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
});