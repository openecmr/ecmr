import {Component} from "react";
import {Alert, FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, LoadDetailText, MyText, Sizes} from "./Components";
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
                                <Icon name="archive" style={{width: Sizes.ICON_WIDTH, color: 'rgb(0, 115, 209)'}} size={Sizes.ICON_WIDTH} />
                                <LoadDetailText style={{padding: 10}} load={item} />
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
                                              onPress={() => this.editLoad(item, index)}>
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
            const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

            let loadsChanged = this.state.oldLoads && !equal(this.state.oldLoads, this.state.loads);

            navigate('AddPhotos', {
                item: this.state.contract,
                site: this.state.site,
                ...(loadsChanged && {
                    oldLoads: this.state.oldLoads
                })
            });
        }
    }

    editLoad(load, index) {
        const {navigate} = this.props.navigation;
        navigate('AddLoadConfirm', {
            editLoad: load,
            onSave: (load) => {
                const contract = this.state.contract;

                if (!this.state.oldLoads) {
                    this.setState({
                        oldLoads: [...this.state.contract.loads.map(l => ({...l}))]
                    })
                }

                const loads = [...contract.loads.map(l => ({...l}))];
                loads[index] = load;
                contract.loads = loads;
                this.setState({
                    contract
                });
            }
        });
    }
}

export default ConfirmLoading;