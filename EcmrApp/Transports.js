import React, {Component} from "react";
import {SectionList, StyleSheet, Text, TouchableOpacity, View, Dimensions} from "react-native";
import * as queries from "./graphql/queries";
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {Address, ArrivalDate, LicensePlates, MyText, Packages} from './Components';
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import ContractModel from "./ContractModel";
import {Icon} from "react-native-elements";
import {activate} from "./graphql/mutations";

const NoContracts = () =>
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 40}}>
        <MyText>All done, no pending contracts assigned to you.</MyText>
    </View>;

const ForwardIcon = () =>
    <Icon size={20}
          containerStyle={{position: "absolute", right: 10, top: "35%"}} reverse
          color={"rgb(60, 167, 60)"} name={"keyboard-arrow-right"} ellipsizeMode={"middle"} raised/>;

class ContractsList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    ListEmptyComponent={<NoContracts/>}
                    onRefresh={this.props.onRefresh}
                    refreshing={this.props.refreshing}
                    sections={this.props.contracts}
                    renderItem={({item}) => {
                        const contract = new ContractModel(item);
                        const isDone = site => this.props.showFirstAction && contract.siteDone(site);
                        const activeSite = contract.activeSite();

                        return (<View style={styles.card}>
                            <View style={styles.transportCardHeader}>
                                <MyText style={styles.transportCardHeaderId}>TRANSPORT {contract.id.substring(0, 8)}</MyText>
                                <MyText style={styles.transportCardHeaderProgress}>{this.progressText(contract)}</MyText>
                            </View>
                            <TouchableOpacity onPress={() => this.props.open(contract, 'pickup')}>
                                <View style={{...styles.transportCardPart, ...(isDone('pickup') && styles.transportCardPartDone)}}>
                                    {isDone('pickup') && <MyText style={styles.doneLabel}>DONE</MyText>}
                                    <MyText style={styles.upperCaseLabel}>pickup</MyText>
                                    <Address address={contract.pickup}/>
                                    <ArrivalDate date={contract.arrivalDate} time={contract.arrivalTime}/>
                                    <Packages total={contract.total()}/>
                                    <LicensePlates truck={contract.truck} trailer={contract.trailer}/>
                                    {activeSite === 'pickup' && <ForwardIcon/>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.open(contract, 'delivery')}>
                                <View style={{...styles.transportCardPart, ...(isDone('delivery') && styles.transportCardPartDone), ...styles.transportCardPartNotFirst}}>
                                    {isDone('delivery') && <MyText style={styles.doneLabel}>DONE</MyText>}
                                    <MyText style={styles.upperCaseLabel}>delivery</MyText>
                                    <Address address={contract.delivery}/>
                                    <ArrivalDate date={contract.deliveryDate} time={contract.deliveryTime}/>
                                    <Packages total={contract.total()}/>
                                    <LicensePlates truck={contract.truck} trailer={contract.trailer}/>
                                    {activeSite === 'delivery' && <ForwardIcon/>}
                                </View>
                            </TouchableOpacity>
                        </View>);
                    }}
                    renderSectionHeader={({section}) => <Text
                        style={styles.sectionHeader}>{section.title ? section.title : "unknown date"}</Text>}
                    keyExtractor={(item, index) => item.id}
                />
            </View>
        );
    }

    progressText(item) {
        const pickupLabels = {
            Acknowledged: "acknowledged",
            ArrivalOnSite: "arrived on pickup site",
            LoadingComplete: "loading complete",
            UnloadingComplete: "done"
        };

        const deliveryLabels = {
            Acknowledged: "acknowledged",
            ArrivalOnSite: "arrived on delivery site",
            LoadingComplete: "unloading complete",
            UnloadingComplete: "done"
        };

        if (item.needAcknowledge) {
            return "need acknowledge";
        } else {
            const deliveryState = this.determineActionDelivery(item);
            if (deliveryState) {
                return deliveryLabels[deliveryState];
            } else {
                const pickupState = this.determineActionPickup(item);
                return pickupLabels[pickupState];
            }
        }
    }

    determineActionDelivery(item) {
        const actions = ['Acknowledged', 'ArrivalOnSite', 'UnloadingComplete'];
        const events = (item.events || []).filter(e => e.site === "delivery" && actions.indexOf(e.type) !== -1).map(e => e.type);
        return events.length === 0 ? null : events[events.length - 1];
    }

    determineActionPickup(item) {
        const actions = ['Acknowledged', 'ArrivalOnSite', 'LoadingComplete'];
        const events = (item.events || []).filter(e => e.site === "pickup" && actions.indexOf(e.type) !== -1).map(e => e.type);
        return events.length === 0 ? actions[0] : events[events.length - 1];
    }
}

const tabIndicatorColor = 'rgb(0,115,209)';
const tabBackgroundColor = 'rgb(245,245,245)';

class Transports extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Open e-CMR'
    });

    constructor(props) {
        super(props);

        this.state = {
            navigationState: {
                index: 0,
                routes: [
                    { key: 'open', title: 'Pending' },
                    { key: 'done', title: 'Done' }
                ]
            },

            ongoingContracts: [],
            doneContracts: [],
            refreshing: false
        };

        this.navigationEventSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                this.onRefresh();
            }
        );
    }

    render() {
        const renderScene = ({ route }) => {
            switch (route.key) {
                case 'open':
                    return <ContractsList open={(item, site) => this.open(item, site)}
                                          contracts={this.state.ongoingContracts}
                                          onRefresh={() => this.onRefresh()}
                                          showFirstAction={true}
                                          refreshing={this.state.refreshing} />;
                case 'done':
                    return <ContractsList open={(item, site) => this.open(item, site)}
                                          contracts={this.state.doneContracts}
                                          onRefresh={() => this.onRefresh()}
                                          refreshing={this.state.refreshing} />;
                default:
                    return null;
            }
        };

        return (
            <TabView
                navigationState={this.state.navigationState}
                renderScene={renderScene}
                onIndexChange={index => this.setState({
                    navigationState: { ...this.state.navigationState, index }
                })}
                initialLayout={{
                    width: Dimensions.get('window').width
                }}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: tabIndicatorColor }}
                        style={{ backgroundColor: tabBackgroundColor }}
                        activeColor={tabIndicatorColor}
                        inactiveColor={tabIndicatorColor}
                    />
                }
            />
        );
    }

    open(item, site) {
        const {navigate} = this.props.navigation;
        navigate('Transport', {
            item: item,
            site: site
        });
    }

    async onRefresh() {
        this.setState({
            refreshing: true
        });
        await this.loadData();
        this.setState({
            refreshing: false
        });
    }

    componentWillUnmount() {
        this.navigationEventSubscription.remove();
    }

    async loadData() {
        const response = await API.graphql(graphqlOperation(queries.contractsByCarrierArrivalDate, {
            limit: 50,
            carrierUsername: (await Auth.currentAuthenticatedUser()).getUsername(),
            sortDirection: "DESC"
        }));
        const contracts = response.data.contractsByCarrierArrivalDate.items;
        const ongoingContracts = this.groupByDate(contracts.filter(c => c.status !== 'DONE'));
        const doneContracts = this.groupByDate(contracts.filter(c => c.status === 'DONE'));

        this.setState({
            ongoingContracts: ongoingContracts,
            doneContracts: doneContracts
        });
    }

    groupByDate(contracts) {
        const groupedContracts = contracts.reduce((acc, contract) => {
            const arrivalDate = contract.arrivalDate;
            if (acc[arrivalDate]) {
                acc[arrivalDate].data.push(contract);
            } else {
                acc[arrivalDate] = {
                    title: arrivalDate,
                    id: arrivalDate,
                    data: [contract]
                };
            }
            return acc;
        }, {});
        const sortedContracts = Array.from(Object.values(groupedContracts));
        return sortedContracts;
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
        fontWeight: 'bold',
        paddingRight: 5,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    transportCardHeaderProgress: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        position: 'absolute',
        right: 10,
        top: 10,
        borderRadius: 15,
        backgroundColor: 'rgb(60, 167, 60)',

        paddingRight: 10,
        paddingLeft: 10,
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
    transportCardPartNotFirst: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'black',
    },
    upperCaseLabel: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    transportCardPartDone: {
        backgroundColor: 'rgb(226, 255, 225)'
    },
    doneLabel: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 10,
        top: 5,
        right: 20,
        position: 'absolute',
        color: 'rgb(84, 162, 87)'
    }
});