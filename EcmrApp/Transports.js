import React, {Component} from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import {API, Auth, graphqlOperation, Hub, I18n} from 'aws-amplify';
import {Address, ArrivalDate, LicensePlates, MyText, Packages, Sizes} from './Components';
import {TabBar, TabView} from "react-native-tab-view";
import ContractModel from "./ContractModel";
import {Button, Icon} from "react-native-elements";
import {default as FIcon5} from "react-native-vector-icons/FontAwesome5";

const NoContracts = () =>
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1,  padding: 5, paddingTop: 40}}>
        <MyText style={{"fontWeight": "bold", textAlign: 'center'}}>{I18n.get("All done, no pending transports assigned to you.")}</MyText>
        <MyText style={{"marginTop": 10, "marginBottom": 15, textAlign: 'center'}}>{I18n.get("New transports can be created through the app or the portal")}</MyText>

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
                    ListEmptyComponent={this.props.showEmpty ? <NoContracts/> : null}
                    onRefresh={this.props.onRefresh}
                    refreshing={this.props.refreshing}
                    sections={this.props.contracts}
                    onEndReached={this.props.onEndReached}
                    renderItem={({item}) => {
                        const contract = new ContractModel(item);
                        const isDone = site => this.props.showFirstAction && contract.siteDone(site);
                        const activeSite = contract.activeSite();

                        return (<View style={styles.card}>
                            <View style={{...styles.transportCardHeader}}>
                                <MyText style={styles.transportCardHeaderId}>{I18n.get("TRANSPORT")} {contract.openecmrId || contract.id.substring(0, 8)}</MyText>
                                <MyText style={styles.transportCardHeaderProgress}>{this.progressText(contract)}</MyText>
                            </View>
                            <TouchableOpacity onPress={() => this.props.open(contract, 'pickup')}>
                                <View style={{...styles.transportCardPart, ...(isDone('pickup') && styles.transportCardPartDone)}}>
                                    {isDone('pickup') && <MyText style={styles.doneLabel}>{I18n.get("DONE")}</MyText>}
                                    <MyText style={{...styles.transportCardPartTitle}}>{I18n.get("pickup")}</MyText>
                                    <View style={{paddingLeft: 5}}>
                                        <Address address={contract.pickup}/>
                                        <ArrivalDate date={contract.arrivalDate} time={contract.arrivalTime}/>
                                        <Packages total={contract.total()}/>
                                        <LicensePlates truck={contract.truck} trailer={contract.trailer}/>
                                    </View>
                                    {activeSite === 'pickup' && <ForwardIcon/>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.open(contract, 'delivery')}>
                                <View style={{...styles.transportCardPart, ...(isDone('delivery') && styles.transportCardPartDone), ...styles.transportCardPartNotFirst}}>
                                    {isDone('delivery') && <MyText style={styles.doneLabel}>{I18n.get("DONE")}</MyText>}
                                    <MyText style={styles.transportCardPartTitle}>{I18n.get("delivery")}</MyText>
                                    <View style={{paddingLeft: 5}}>
                                        <Address address={contract.delivery}/>
                                        <ArrivalDate date={contract.deliveryDate} time={contract.deliveryTime}/>
                                        <Packages total={contract.total()}/>
                                        <LicensePlates truck={contract.truck} trailer={contract.trailer}/>
                                    </View>
                                    {activeSite === 'delivery' && <ForwardIcon/>}
                                </View>
                            </TouchableOpacity>
                        </View>);
                    }}
                    renderSectionHeader={({section}) => <Text
                        style={styles.sectionHeader}>{section.title ? section.title : I18n.get("unknown date")}</Text>}
                    keyExtractor={(item, index) => item.id}
                    ListFooterComponent={() => <View style={{paddingTop: 5, paddingBottom: 5}}><ActivityIndicator size="small" color="rgb(0, 115, 209)" animating={!this.props.loadedAllItems}/></View>}
                />
            </View>
        );
    }

    progressText(item) {
        const pickupLabels = {
            Acknowledged: I18n.get("acknowledged"),
            ArrivalOnSite: I18n.get("arrived on pickup site"),
            LoadingComplete: I18n.get("loading complete"),
            UnloadingComplete: I18n.get("done")
        };

        const deliveryLabels = {
            Acknowledged: I18n.get("acknowledged"),
            ArrivalOnSite: I18n.get("arrived on delivery site"),
            LoadingComplete: I18n.get("unloading complete"),
            UnloadingComplete: I18n.get("done")
        };

        if (item.needAcknowledge) {
            return I18n.get("need acknowledge");
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

let checkedCompany = false;

function resetCompanyCheck() {
    checkedCompany = false;
}

function CompanyOnBoarding({companyOnBoardingStep, loading, onChangeText, onPress, onPress1, onCreateOwnCompanyPress, value, visible}) {
    return <Modal visible={visible}>
        {companyOnBoardingStep === "select" && <View style={{
            backgroundColor: "rgb(0, 115, 209)",
            height: "100%",
            padding: 10,
            justifyContent: "flex-start",
            alignContent: "center"
        }}>
            <MyText style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 16,
                textAlign: "center",
                paddingTop: 50
            }}>{I18n.get("Welcome to Open eCMR, let's get you ready!")}</MyText>
            <View style={{flexDirection: "column", alignItems: "center", width: "100%"}}>
                <TouchableOpacity onPress={onPress} style={{
                    marginTop: 50,
                    width: 200,
                    height: 120,
                    flexDirection: "column",
                    justifyContent: "center",
                    elevation: 10,
                    padding: 15,
                    borderRadius: 2,
                    backgroundColor: "rgb(0, 115, 209)"
                }}>
                    <FIcon5 name={"desktop"} size={20} style={{textAlign: "center", color: "white"}}/>
                    <MyText style={{
                        marginTop: 5,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white"
                    }}>{I18n.get("I have a link code and want to join a company")}</MyText>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPress1} style={{
                    marginTop: 50,
                    width: 200,
                    height: 120,
                    flexDirection: "column",
                    justifyContent: "center",
                    elevation: 10,
                    padding: 15,
                    borderRadius: 2,
                    backgroundColor: "rgb(0, 115, 209)"
                }}>
                    <FIcon5 name={"archive"} size={20} style={{textAlign: "center", color: "white"}}/>
                    <MyText style={{
                        marginTop: 5,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white"
                    }}>{I18n.get("I want to create my own company")}</MyText>
                </TouchableOpacity>
            </View>
        </View>}
        {companyOnBoardingStep === "createOwnCompany" && <View style={{
            backgroundColor: "rgb(0, 115, 209)",
            height: "100%",
            padding: 10,
            justifyContent: "flex-start",
            alignContent: "center"
        }}>
            <MyText style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 16,
                textAlign: "center",
                paddingTop: 50
            }}>{I18n.get("Please enter the name of your new company")}</MyText>
            <View style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginTop: 25,
                paddingLeft: 25,
                paddingRight: 25
            }}>
                <TextInput
                    keyboardType={"default"}
                    autoCapitalize={"words"}
                    autoCorrect={false}
                    autoFocus={true}
                    value={value}
                    style={{
                        width: "100%",
                        margin: 0,
                        padding: 5,
                        fontSize: 16,
                        color: "white",
                        borderColor: "white",
                        borderStyle: "dotted",
                        backgroundColor: "grey",
                        borderBottomWidth: StyleSheet.hairlineWidth
                    }}
                    onChangeText={onChangeText}/>
                <Button containerStyle={{marginTop: 25, width: "80%"}}
                        title={I18n.get("Continue")}
                        buttonStyle={{height: 60, backgroundColor: "rgb(60,176,60)"}}
                        loading={loading}
                        onPress={onCreateOwnCompanyPress}/>
            </View>
        </View>}
    </Modal>;
}

function mapToList(result) {
    const list = Array.from(Object.values(result));
    return list.sort((a, b) => b.id.localeCompare(a.id));
}

class Transports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigationState: {
                index: 0,
                routes: [
                    { key: 'open', title: I18n.get('Pending') },
                    { key: 'done', title: I18n.get('Done') }
                ]
            },
            ongoingContracts: [],
            ongoingContractsResult: {},
            doneContracts: [],
            doneContractsResult: {},
            refreshing: false,
            firstLoad: true,
            companyOnBoarding: false,
            companyOnBoardingStep: "select"
        };

        Hub.listen('Contracts', ({payload}) => {
            const { event, data: { contract } } = payload;

            const addMap = (contract, map) => {
                const arrivalDate = contract.arrivalDate;
                if (map[arrivalDate]) {
                    map[arrivalDate].data.push(contract);
                } else {
                    map[arrivalDate] = {
                        title: arrivalDate,
                        id: arrivalDate,
                        data: [contract]
                    };
                }
            }

            const updateMap = (contract, map) => {
                for (const item of Object.values(map)) {
                    const idx = item.data.findIndex(c => c.id === contract.id);
                    if (idx !== -1) {
                        if (contract.status === 'DONE') {
                            item.data.splice(idx, 1);
                            if (item.data.length === 0) {
                                delete map[item.id];
                            }
                        } else {
                            item.data[idx] = contract;
                        }
                        break;
                    }
                }
            }

            if (event === 'update') {
                updateMap(contract, this.state.ongoingContractsResult);
                if (contract.status === 'DONE') {
                    addMap(contract, this.state.doneContractsResult);
                }
                this.setState({
                    ongoingContracts: mapToList(this.state.ongoingContractsResult),
                    doneContracts: mapToList(this.state.doneContractsResult)
                });
            } else if (event === 'create') {
                addMap(contract, this.state.ongoingContractsResult);
                this.setState({
                    ongoingContracts: mapToList(this.state.ongoingContractsResult)
                });
            }
        });

        this.selectCreateOwnCompany = this.selectCreateOwnCompany.bind(this);
        this.onCompanyNameChange = this.onCompanyNameChange.bind(this);
        this.createOwnCompany = this.createOwnCompany.bind(this);
        this.selectAccessCode = this.selectAccessCode.bind(this);

        this.navigationEventSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.refreshIfNeeded();
            }
        );
    }

    async componentDidMount() {
        if (!checkedCompany && !this.state.companyOnBoarding) {
            await this.checkCompany();
        }
    }

    render() {
        const renderScene = ({ route }) => {
            switch (route.key) {
                case 'open':
                    return <ContractsList open={(item, site) => this.open(item, site)}
                                          contracts={this.state.ongoingContracts}
                                          onEndReached={() => this.loadNextOngoingData()}
                                          onRefresh={() => this.onRefresh()}
                                          showFirstAction={true}
                                          showEmpty={!this.state.firstLoad}
                                          refreshing={this.state.refreshing}
                                          loadedAllItems={!this.state.ongoingContractsNextToken}
                    />;
                case 'done':
                    return <ContractsList open={(item, site) => this.open(item, site)}
                                          contracts={this.state.doneContracts}
                                          onEndReached={() => this.loadNextDoneData()}
                                          onRefresh={() => this.onRefresh()}
                                          refreshing={this.state.refreshing}
                                          loadedAllItems={!this.state.doneContractsNextToken} />;
                default:
                    return null;
            }
        };

        return (
            <View style={{width: "100%", height: "100%"}}>
                <TabView
                    navigationState={this.state.navigationState}
                    renderScene={renderScene}
                    onIndexChange={index => this.setState({
                        navigationState: {...this.state.navigationState, index}
                    })}
                    initialLayout={{
                        width: Dimensions.get('window').width
                    }}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            indicatorStyle={{backgroundColor: tabIndicatorColor}}
                            style={{backgroundColor: tabBackgroundColor}}
                            activeColor={tabIndicatorColor}
                            inactiveColor={tabIndicatorColor}
                        />
                    }
                />
                <CompanyOnBoarding visible={this.state.companyOnBoarding}
                                   companyOnBoardingStep={this.state.companyOnBoardingStep}
                                   onPress={this.selectAccessCode} onPress1={this.selectCreateOwnCompany}
                                   value={this.state.companyName} onChangeText={this.onCompanyNameChange}
                                   loading={this.state.loading} onCreateOwnCompanyPress={this.createOwnCompany}/>
            </View>
        );
    }

    onCompanyNameChange(companyName) {
        this.setState({
            companyName
        });
    }

    selectAccessCode() {
        this.setState({
            companyOnBoarding: false
        });
        const {navigate} = this.props.navigation;
        navigate('LinkAccount');
    }

    selectCreateOwnCompany() {
        this.setState({
            companyOnBoardingStep: "createOwnCompany"
        });
    }

    async createOwnCompany() {
        const companyName = this.state.companyName;
        if (!companyName) {
            Alert.alert(
                I18n.get('Required information'),
                I18n.get('Please enter the name of the company'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            return;
        }
        this.setState({
            loading: true
        });
        const currentUser = await Auth.currentAuthenticatedUser();
        const username = currentUser.getUsername();
        const companyResult = await API.graphql(graphqlOperation(mutations.createCompany, {
            input: {
                owner: username,
                name: companyName
            }
        }));
        const companyId = companyResult.data.createCompany.id;
        await API.graphql(graphqlOperation(mutations.createContact, {
            input: {
                owner: username,
                name: companyName
            }
        }));
        await API.graphql(graphqlOperation(mutations.createDriver, {
            input: {
                owner: username,
                name: companyName + " driver",
                carrier: username
            }
        }));
        await API.graphql(graphqlOperation(mutations.createVehicle, {
            input: {
                companyId: companyId,
                owner: username,
                licensePlateNumber: "ab-12-34",
                type: "TRUCK",
                description: companyName + " truck"
            }
        }));
        await API.graphql(graphqlOperation(mutations.createVehicle, {
            input: {
                companyId: companyId,
                owner: username,
                licensePlateNumber: "ab-12-35",
                type: "TRAILER",
                description: companyName + " trailer"
            }
        }));
        const currentSession = await Auth.currentSession();
        currentUser.refreshSession(currentSession.refreshToken, (err, session) => {
        });
        this.setState({
            companyOnBoarding: false
        });
    }

    open(item, site) {
        const {navigate} = this.props.navigation;
        navigate('Transport', {
            item: item,
            site: site
        });
    }

    async refreshIfNeeded() {
        const {lastRefresh} = this.state;
        if (lastRefresh && new Date().getTime() - lastRefresh.getTime() < 300 * 1000) {
            return;
        }
        await this.onRefresh();
    }

    async onRefresh() {
        this.setState({
            refreshing: true
        });
        await this.loadOngoingContractsData(true);
        await this.loadDoneContractsData(true);
        this.setState({
            refreshing: false,
            firstLoad: false,
            lastRefresh: new Date(),
        });
    }

    async checkCompany() {
        checkedCompany = true;
        const user = await Auth.currentAuthenticatedUser();
        const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
        if (groups && groups.filter(x => !x.endsWith('_Google')).length > 0) {
            return;
        }
        const companyResponse = await API.graphql(graphqlOperation(queries.companyByOwner, {
            limit: 50,
            owner: (await Auth.currentAuthenticatedUser()).getUsername(),
            sortDirection: "DESC"
        }));
        if (companyResponse.data.companyByOwner.items.length !== 0) {
            return;
        }
        this.setState({
            companyOnBoarding: true,
            companyOnBoardingStep: "select"
        });
    }

    async loadOngoingContractsData(refresh) {
        if (this.state.ongoingContractsFetching) {
            return;
        }
        this.setState({
            ongoingContractsFetching: true
        });
        let response, nextToken = refresh ? null : this.state.ongoingContractsNextToken;
        do {
            response = await API.graphql(graphqlOperation(queries.contractsByCarrierArrivalDate, {
                limit: 25,
                carrierUsername: (await Auth.currentAuthenticatedUser()).getUsername(),
                filter: {
                    status: {
                        ne: "DONE"
                    }
                },
                nextToken: nextToken,
                sortDirection: "DESC"
            }));
            nextToken = response.data.contractsByCarrierArrivalDate.nextToken;
        } while (response.data.contractsByCarrierArrivalDate.items.length === 0 && nextToken)
        const contracts = response.data.contractsByCarrierArrivalDate.items;
        const ongoingContracts = this.groupByDate(refresh ? {} : this.state.ongoingContractsResult, contracts);

        this.setState({
            ongoingContractsResult: ongoingContracts,
            ongoingContracts: mapToList(ongoingContracts),
            ongoingContractsNextToken: nextToken,
            ongoingContractsFetching: false
        });
    }

    async loadDoneContractsData(refresh) {
        if (this.state.doneContractsFetching) {
            return;
        }
        this.setState({
            doneContractsFetching: true
        });
        let response, nextToken = refresh ? null : this.state.doneContractsNextToken;
        do {
            response = await API.graphql(graphqlOperation(queries.contractsByCarrierArrivalDate, {
                limit: 15,
                carrierUsername: (await Auth.currentAuthenticatedUser()).getUsername(),
                filter: {
                    status: {
                        eq: "DONE"
                    }
                },
                nextToken: nextToken,
                sortDirection: "DESC"
            }));
            nextToken = response.data.contractsByCarrierArrivalDate.nextToken;
        } while (response.data.contractsByCarrierArrivalDate.items.length === 0 && nextToken)
        const contracts = response.data.contractsByCarrierArrivalDate.items;
        const doneContracts = this.groupByDate(refresh ? {} : this.state.doneContractsResult, contracts);

        this.setState({
            doneContractsResult: doneContracts,
            doneContracts: mapToList(doneContracts),
            doneContractsNextToken: nextToken,
            doneContractsFetching: false
        });
    }

    async loadNextOngoingData() {
        if (this.state.ongoingContractsNextToken) {
            await this.loadOngoingContractsData();
        }
    }

    async loadNextDoneData() {
        if (this.state.doneContractsNextToken) {
            await this.loadDoneContractsData();
        }
    }

    groupByDate(current, contracts) {
        return contracts.reduce((acc, contract) => {
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
        }, current);
    }
}

export default Transports;

export {resetCompanyCheck};

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
        paddingBottom: 10,
        paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER,
        paddingRight: Sizes.PADDING_FROM_SCREEN_BORDER,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgb(150,150,150)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(150,150,150)'
    },
    transportCardHeaderId: {
        fontWeight: 'bold',
        paddingRight: 5,
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
        paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER,
        paddingRight: Sizes.PADDING_FROM_SCREEN_BORDER,
        paddingBottom: Sizes.PADDING_FROM_SCREEN_BORDER,
        elevation: 1,
        backgroundColor: 'white'
    },
    transportCardPartNotFirst: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgb(200, 200, 200)'
    },
    transportCardPartTitle: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        paddingBottom: 5
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