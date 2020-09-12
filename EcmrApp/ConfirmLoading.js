import {Component} from "react";
import {Alert, FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, LoadDetailText, MyText} from "./Components";
import {I18n} from "aws-amplify";

class ConfirmLoading extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: I18n.get('Check loads')
    });

    constructor(props) {
        super(props);
        const item = props.navigation.getParam("item");
        this.state = {
            contract: item,
            site: props.navigation.getParam("site"),
            loadConfirmed: Array(item.loads.length).fill(false)
        };
    }


    render() {
        const contract = this.state.contract;
        const loads = contract.loads;

        return (

            <FlatList
                data={loads}
                extraData={this.state}
                keyExtractor={(item, index) => String(index)}
                renderItem={({item, index}) => (
                    <View style={{backgroundColor: 'white', elevation: 5,
                        marginBottom: 10}}>
                        <View style={{padding: 10}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Icon name="dropbox" style={{color: 'rgb(0, 115, 209)', paddingRight: 10}} size={30} />
                                <LoadDetailText load={item} />
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <View style={{flex: 1}}>
                                    <MyText>{I18n.get('Shipper')}</MyText>
                                    <Address hideIcon={true} address={contract.shipper}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <MyText>{I18n.get('Destination')}</MyText>
                                    <Address hideIcon={true} address={contract.delivery}/>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", marginTop: 10,
                            borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgb(200, 200, 200)',
                            borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgb(200, 200, 200)'}}>
                            <TouchableOpacity style={{flex: 1, padding: 10, alignItems: 'center', borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: 'rgb(200, 200, 200)'}}
                                              onPress={() => this.editLoad()}>
                                <Icon name="pencil" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
                                <MyText>{I18n.get('Edit')}</MyText>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1, padding: 10, alignItems: 'center',
                                    ...(this.state.loadConfirmed[index] && {backgroundColor: 'rgb(227,255,225)'})}}
                                              onPress={() => this.confirmLoad(index)}>
                                <Icon name="check" style={{flex: 1, color: 'green'}} size={30} />
                                <MyText>{I18n.get('Confirm')}</MyText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    )
                }
            />
        )
    }

    confirmLoad(index) {
        const {loadConfirmed} = this.state;
        loadConfirmed[index] = !loadConfirmed[index];
        this.setState({
            loadConfirmed: loadConfirmed
        });

        const ready = loadConfirmed.every(b => b);
        if (ready) {
            const {navigate} = this.props.navigation;
            navigate('AddPhotos', {
                item: this.state.contract,
                site: this.state.site
            });
        }
    }

    editLoad() {
        Alert.alert(
            I18n.get('Not available'),
            I18n.get('This option is not yet available.'),
            [
                {text: I18n.get('OK')}
            ],
            {cancelable: true}
        );
    }
}

export default ConfirmLoading;