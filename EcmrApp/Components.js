import React from "react";
import {Modal, Text, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {Button} from "react-native-elements";

const MyText = ({style, children}) => <Text style={{...style, color: style && style.color ? style.color : 'black'}}>{children}</Text>;

const Address = ({address, style, hideIcon}) => (
    <View style={{ flexDirection: 'row', ...style}}>
        {!hideIcon && <Icon name="location-arrow" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />}
        <View style={{flex: 8}}>
            <MyText><MyText style={{fontWeight: 'bold'}}>{address.postalCode}</MyText> {address.city} {address.country}</MyText>
            <MyText>{address.address}</MyText>
            <MyText style={{fontWeight: 'bold'}}>{address.name}</MyText>
        </View>
    </View>
);

const Packages = ({total}) => (
    <View style={{flexDirection: 'row', paddingTop: 10}}>
        <Icon name="dropbox" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
        <MyText style={{flex: 8}}>{total} packages</MyText>
    </View>
);

const HandOverModal = ({visible, text, onPress}) =>
    <Modal animationType="slide"
           transparent={false}
           visible={visible}>
        <View style={{backgroundColor: 'rgb(0, 115, 209)', height: '100%', padding: 10, justifyContent: "center", alignContent: "center"}}>
            <Text style={{textAlign: "center", marginBottom: 20, fontWeight: "bold", color: 'white', fontSize: 25}}>{text}</Text>
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 15}}>
                <Icon name={"mobile"} size={100} style={{marginRight: 10}} color={"white"}/>
                <Icon name={"arrow-right"} size={50} color={"white"}/>
                <Icon name={"user"} size={120} color={"white"}/>
            </View>
            <Button
                buttonStyle={{height: 60, backgroundColor: "rgb(60,176,60)"}}
                title={"Ready"}
                onPress={onPress}/>
        </View>
    </Modal>;

export {
    MyText,
    Address,
    Packages,
    HandOverModal
};