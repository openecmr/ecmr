import {Component} from "react";
import {FlatList, SectionList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, MyText} from "./Components";
import {Button, CheckBox} from "react-native-elements";

import SignatureCapture from 'react-native-signature-capture';

class Signature extends Component {


    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
        };
    }


    render() {
        return (
            <View style={{padding: 10, flex: 1}}>
                <MyText style={{fontWeight: 'bold', fontSize: 17, textAlign: 'center'}}>Consignor, please check the information below before signing</MyText>
                <MyText style={{marginTop: 10, color: 'rgb(66,133,244)', textAlign: 'center'}}>By checking the box below, I agree with the terms and conditions of this carrier.</MyText>


                <CheckBox
                    title={'I agree with this information'}
                    containerStyle={{backgroundColor: 'white', marginTop: 10}}
                    center
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checked}
                />

                <MyText style={{fontWeight: 'bold'}}>Loads:</MyText>
                <View style={{marginLeft: 10}}>
                    <FlatList
                        data={this.state.contract.loads}
                        extraData={this.state}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({item, index}) => (
                            <MyText>{item.quantity} {item.category}, {item.description}</MyText>
                        )}/>
                </View>

                <MyText style={{fontWeight: 'bold', marginTop: 5}}>Driver observations:</MyText>
                <MyText style={{marginLeft: 10}}>No observations</MyText>

                <MyText style={{fontWeight: 'bold', marginTop: 5}}>Signatory observations:</MyText>
                <MyText style={{marginLeft: 10}}>No observations</MyText>

                <SignatureCapture
                    style={{flex:1, borderWidth: 1, borderColor: '#000033', padding: 5, margin: 5}}
                    ref="sign"
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    showBorder={true}
                    viewMode={"portrait"}/>

                <View style={{flexDirection: 'row', margin: 10, marginTop: 5, position: 'absolute', bottom: 0, left: 10}}>
                    <Button containerStyle={{flex: 1, marginRight: 15}} buttonStyle={{height: 60}} title={"Add observations"}/>
                    <Button containerStyle={{flex: 1}} title={"Sign"} buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}/>
                </View>
            </View>
        )
    }
}

export default Signature;