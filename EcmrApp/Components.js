import React from "react";
import {Text, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const MyText = ({style, children}) => <Text style={{...style, color: style && style.color ? style.color : 'black'}}>{children}</Text>;

const Address = ({address, style}) => (
    <View style={{ flexDirection: 'row', ...style}}>
        <Icon name="location-arrow" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={30} />
        <View style={{flex: 8}}>
            <MyText><MyText style={{fontWeight: 'bold'}}>{address.postalCode}</MyText> {address.city} {address.country}</MyText>
            <MyText>{address.address}</MyText>
            <MyText style={{fontWeight: 'bold'}}>{address.name}</MyText>
        </View>
    </View>
);

export {
    MyText,
    Address
};