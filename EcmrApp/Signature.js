import {Component} from "react";
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput} from "react-native";
import React from "react";
import {Address, HandOverModal, MyText} from "./Components";
import {Button, CheckBox} from "react-native-elements";

class Signature extends Component {


    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site"),
            signatoryName: props.navigation.getParam("signatoryName"),
            signatoryEmail: props.navigation.getParam("signatoryEmail"),
            addingRemark: false,
            handoverPhone: true
        };
    }


    render() {
        return (
            <View style={{padding: 10, flex: 1}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.addingRemark}
                    onRequestClose={() => this.setState({addingRemark: false})}>
                    <View style={{padding: 10}}>
                        <View>
                            <TextInput
                                multiline
                                numberOfLines={5}
                                value={this.state.signatoryObservation}
                                style={{textAlignVertical: 'top',  borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 15}}
                                placeholder="Enter an observation..."
                                onChangeText={(signatoryObservation) => this.setState({signatoryObservation})}/>

                            <Button
                                buttonStyle={{height: 60}}
                                color={"rgb(60,176,60)"}
                                title={"Save"}
                                onPress={() => this.setState({addingRemark: false})}/>
                        </View>
                    </View>
                </Modal>

                <HandOverModal
                    onPress={() => this.setState({handoverPhone: false})}
                    visible={this.state.handoverPhone}
                               text={`Please hand the phone to ${this.state.signatoryName}`}/>

                <MyText style={{fontWeight: 'bold', fontSize: 17, textAlign: 'center'}}>{this.state.signatoryName}, please check the information below before signing</MyText>
                <MyText style={{marginTop: 10, color: 'rgb(66,133,244)', textAlign: 'center'}}>By checking the box below, I agree with the terms and conditions of this carrier.</MyText>


                <CheckBox
                    onPress={() => this.toggleAgreeWithInformation()}
                    title={'I agree with this information'}
                    containerStyle={{backgroundColor: 'white', marginTop: 10}}
                    center
                    checkedIcon='check-square'
                    uncheckedIcon='square'
                    checked={this.state.agree}
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
                <MyText style={{marginLeft: 10}}>{this.state.signatoryObservation || "No observations"}</MyText>

                <View style={{flexDirection: 'row', margin: 10, marginTop: 5, position: 'absolute', bottom: 0, left: 10}}>
                    <Button containerStyle={{flex: 1, marginRight: 15}} buttonStyle={{height: 60}} title={"Add observations"}
                            onPress={() => this.setState({addingRemark: true})}/>
                    <Button containerStyle={{flex: 1}} title={"Sign"} buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                            onPress={() => this.captureSignature()}/>
                </View>
            </View>
        )
    }

    toggleAgreeWithInformation() {
        this.setState({
            agree: !this.state.agree
        })
    }

    captureSignature() {
        if (!this.state.agree) {
            Alert.alert(
                'Agree with information',
                'In order to sign you must agree with the provided information',
                [
                    {text: 'OK'}
                ],
                {cancelable: true}
            );
            return;
        }

        const {navigate} = this.props.navigation;
        navigate('CaptureSignature', {
            item: this.state.contract,
            site: this.state.site,
            signatoryName: this.state.signatoryName,
            signatoryEmail: this.state.signatoryEmail,
            signatoryObservation: this.state.signatoryObservation
        });
    }
}

export default Signature;