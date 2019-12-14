import {Component} from "react";
import {FlatList, StyleSheet, TouchableOpacity, View, Text} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, MyText} from "./Components";

class SignSelection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site")
        };
    }

    render() {
        return (
            <View style={{alignItems: 'center', backgroundColor: 'rgb(245,245,245)', flex: 1}}>
                <Text style={{paddingTop: 20, color: 'rgb(0, 115, 209)', fontSize: 25}}>How does the sender sign?</Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                    <TouchableOpacity style={{alignItems: 'center', backgroundColor: 'white', width: 150, borderRadius: 10,
                        borderWidth: 4, borderColor: 'rgb(187,187,187)', padding: 5, margin: 10}} onPress={() => this.signOnPhone()}>
                        <Icon name={"pencil-square-o"} color={'rgb(187,222,251)'} size={50}/>
                        <MyText>On the phone</MyText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', width: 150, borderRadius: 10,
                        borderWidth: 4, borderColor: 'rgb(187,187,187)', padding: 5, margin: 10}} onPress={() => console.warn("eqw")}>
                        <Icon name={"ban"} size={50} />
                        <MyText>No one on pickup site</MyText>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    signOnPhone() {
        const {navigate} = this.props.navigation;
        navigate('SignatoryInformation', {
            item: this.state.contract,
            site: this.state.site
        });
    }
}

export default SignSelection;