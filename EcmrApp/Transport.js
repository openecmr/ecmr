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

const Header = ({children}) => <MyText style={{backgroundColor: 'rgb(240,240,240)', fontWeight: 'bold', padding: 15, paddingLeft: 10}}>{children}</MyText>;

class Transport extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Pickup: ' + navigation.getParam('item').pickup.name
    });

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const item = this.state;
        if (!item.id) {
            return <MyText>Loading...</MyText>
        }

        const total = 5;

        const actions = ['ArrivalOnSite', 'LoadingComplete', /*'DepartureFromSite'*/];
        const events = (item.events || []).filter(e => e.site === "pickup" && actions.indexOf(e.type) !== -1).map(e => e.type);
        actions.splice(0, events.length === 0 ? 0 : actions.indexOf(events[events.length - 1]) + 1);
        const firstAction = actions.length === 0 ? '' : actions[0];

        return (
            <View style={{backgroundColor: 'white'}}>
                <Header>Details</Header>
                <Address address={item.pickup}
                    style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'black', padding: 10}}
                />

                <View style={{flexDirection: 'row', padding: 10}}>
                    <Icon name="dropbox" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
                    <MyText style={{flex: 8}}>{total} packages</MyText>
                </View>
                <View style={{backgroundColor: 'rgb(240,240,240)', padding: 10}}>
                    {firstAction === 'ArrivalOnSite' && <Button title={"Notify arrival at unloading site"} color={"rgb(60,176,60)"} onPress={() => this.confirmNotifyArrival()}/>}
                    {firstAction === 'LoadingComplete' && <Button title={"Confirm loading"} color={"rgb(60,176,60)"} onPress={() => this.confirmLoading()}/>}
                    {!firstAction &&
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon color={'rgb(5, 172, 5)'} size={30} name='check-circle'/>
                            <Text style={{color: 'rgb(5, 172, 5)', fontWeight: 'bold', paddingLeft: 5}}>Activity done</Text>
                        </View>
                    }
                </View>
                <Header>Activity feed</Header>
                <FlatList
                    data={[...item.events || []].reverse()}
                    extraData={this.state}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({item}) =>
                        (<View style={{padding: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'black'}}>
                            <Text style={{fontSize: 12}}>{moment(item.createdAt).format('llll')}</Text>

                            <MyText>{this.eventText(item)}</MyText>

                            {
                                item.type === 'LoadingComplete' &&
                                    <S3Image style={{height: 100, width: 50}} imgKey={item.signature.signatureImageSignatory.key} />
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
                return `${event.author.username} arrived on loading site.`;
            case 'LoadingComplete':
                return `${event.author.username} completed the loading.`;
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
            site: "pickup",
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

export default Transport;