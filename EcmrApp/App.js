import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, SectionList} from 'react-native';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import * as queries from "./graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

Amplify.configure(awsmobile);

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
class App extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            notes: []
        };
    }

    renderItem(item) {


        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'powderblue', paddingTop: 10, paddingBottom: 10}}>
                    <Text style={{flex: 2, fontWeight: 'bold', paddingRight: 5, paddingLeft: 5, paddingTop: 5, paddingBottom: 5}}>TRANSPORT 341133</Text>
                    <Text style={{flex: 1, textAlign: 'center', color: 'white', fontWeight: 'bold', right: 5, paddingRight: 5, paddingLeft: 5, paddingTop: 5, paddingBottom: 5, borderRadius: 15, backgroundColor: 'rgb(60, 167, 60)'}}>loading complete</Text>
                </View>
                <View style={{flex: 1, padding: 5}}>
                    <Text style={{fontWeight: 'bold'}}>origin</Text>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Icon name="location-arrow" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
                        <View style={{flex: 8}}>
                            <Text>1234 AA Vlaardingen</Text>
                            <Text>Dirk de Derdelaan</Text>
                            <Text>Bloemenzaak</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', paddingTop: 10}}>
                        <Icon name="dropbox" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
                        <Text style={{flex: 8}}>56 packages</Text>
                    </View>
                    <View style={{flex: 1, padding: 5, paddingTop: 20}}>
                        <Text style={{fontWeight: 'bold'}}>destination</Text>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Icon name="location-arrow" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
                            <View style={{flex: 8}}>
                                <Text>1234 AA Vlaardingen</Text>
                                <Text>Dirk de Derdelaan</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', paddingTop: 10}}>
                        <Icon name="dropbox" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
                        <Text style={{flex: 8}}>56 packages</Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    sections={[
                        {title: '12-01-2018', data: ['Devin', 'Devin']},
                        {title: '24-01-2018', data: ['Jackson']},
                    ]}
                    renderItem={({item}) => this.renderItem(item)}
                    renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }

    async componentDidMount() {
        const response = await API.graphql(graphqlOperation(queries.listContracts));
        const contracts = response.data.listContracts.items.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1);

        this.setState({
            notes: contracts
        });
    }
}

export default withAuthenticator(App, true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    sectionHeader: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
