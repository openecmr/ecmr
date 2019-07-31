import {Component} from "react";
import React from "react";
import {Alert, SectionList, StyleSheet, Text, View, Button, FlatList} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, MyText} from "./Components";
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import moment from "moment";
import { Auth } from 'aws-amplify';
import {S3Image} from "aws-amplify-react-native";

const Header = ({children}) => <MyText style={styles.header}>{children}</MyText>;

const Package = ({total}) =>
    <View style={styles.package}>
        <Icon name="dropbox" style={styles.packageIcon} size={30} />
        <MyText style={styles.packageText}>{total} packages</MyText>
    </View>;

const activityDoneColor = 'rgb(5, 172, 5)';
const actionButtonColor = 'rgb(60,176,60)';

class Transport extends Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const site = navigation.getParam('site');
        const item = navigation.getParam('item');
        return {
            title: site + ': ' + item[site].name
        }
    };

    constructor(props) {
        super(props);

        const { navigation } = this.props;

        this.state = {
            'site': navigation.getParam('site')
        };
    }

    render() {
        const item = this.state;
        if (!item.id) {
            return <MyText>Loading...</MyText>
        }

        const total = 5;
        const site = this.state.site;
        const direction = site === 'pickup' ? "loading" : "unloading";
        const actions = site === 'pickup' ?
            ['ArrivalOnSite', 'LoadingComplete', /*'DepartureFromSite'*/] :
            ['ArrivalOnSite', 'UnloadingComplete'];
        const events = (item.events || []).filter(e => e.site === site && actions.indexOf(e.type) !== -1).map(e => e.type);
        actions.splice(0, events.length === 0 ? 0 : actions.indexOf(events[events.length - 1]) + 1);
        const firstAction = actions.length === 0 ? '' : actions[0];

        return (
            <View style={styles.transport}>
                <Header>Details</Header>
                <Address address={item[site]} style={styles.address} />

                <Package total={total} />

                <View style={styles.action}>
                    {firstAction === 'ArrivalOnSite' && <Button title={`Notify arrival at ${direction} site`} color={actionButtonColor} onPress={() => this.confirmNotifyArrival()}/>}
                    {(firstAction === 'LoadingComplete' || firstAction === 'UnloadingComplete') && <Button title={`Confirm ${direction}`} color={actionButtonColor} onPress={() => this.confirmLoading()}/>}
                    {!firstAction &&
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon color={activityDoneColor} size={30} name='check-circle'/>
                            <Text style={styles.activityDoneText}>Activity done</Text>
                        </View>
                    }
                </View>

                <Header>Activity feed</Header>
                <FlatList
                    data={[...item.events || []].reverse()}
                    extraData={this.state}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({item}) =>
                        (<View style={styles.activityItemContainer}>
                            <Text style={{fontSize: 12}}>{moment(item.createdAt).format('llll')}</Text>

                            <MyText>{this.eventText(item)}</MyText>

                            {
                                item.type === 'LoadingComplete' &&
                                    <S3Image style={{width: 150, height: 150}}
                                             resizeMode={'center'}
                                             level={"public"}
                                             imgKey={item.signature.signatureImageSignatory.key} />
                            }
                        </View>)
                    }
                />
            </View>
        );
    }

    eventText(event) {
        switch (event.type) {
            case 'ArrivalOnSite':
                return `${event.author.username} arrived on ${event.site} site.`;
            case 'LoadingComplete':
                return `${event.author.username} completed the loading.`;
            case 'UnloadingComplete':
                return `${event.author.username} completed the unloading.`;
            default:
                return `${event.author.username} completed ${event.type}`;
        }
    }

    confirmLoading() {
        const {navigate} = this.props.navigation;
        navigate('ConfirmLoading', {
            item: this.state
        });
    }

    confirmNotifyArrival() {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to notify your arrival at unloading site?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => this.notifyArrival()}
            ],
            {cancelable: true}
        );
    }

    async notifyArrival() {
        const item = {...this.props.navigation.getParam('item')};
        const now = moment().format();
        const user = await Auth.currentAuthenticatedUser();

        if (!item.events) {
            item.events = [];
        }
        item.events.push({
            type: 'ArrivalOnSite',
            site: this.state.site,
            createdAt: now,
            author: {
                username: user.username
            }
        });

        try {
            await API.graphql(graphqlOperation(mutations.updateContract, {input: item}));
            this.props.navigation.setParams({
                item: item
            });
            this.setState(item);
        } catch (ex) {
            console.log(ex);
        }
    }

    async componentDidMount() {
        const item = this.props.navigation.getParam('item');
        this.setState(item);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    transport: {
        backgroundColor: 'white'
    },
    header: {
        backgroundColor: 'rgb(240,240,240)',
        fontWeight: 'bold',
        padding: 15,
        paddingLeft: 10
    },
    address: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'black',
        padding: 10
    },
    package: {
        flexDirection: 'row',
        padding: 10
    },
    packageIcon: {
        flex: 1,
        color: 'rgb(0, 115, 209)'
    },
    packageText: {
        flex: 8
    },
    action: {
        backgroundColor: 'rgb(240,240,240)',
        padding: 10
    },
    activityDoneText: {
        color: activityDoneColor,
        fontWeight: 'bold',
        paddingLeft: 5
    },
    activityItemContainer: {
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'black'
    }
});

export default Transport;