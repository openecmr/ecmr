import React from "react";
import {Modal, Text, View} from "react-native";
import Icon, {default as FIcon} from "react-native-vector-icons/FontAwesome";
import {Button} from "react-native-elements";
import moment from "moment";

const formatTime = time => moment(time, "HH:mm").format('LT');

const MyText = ({style, children}) => <Text style={{...style, color: style && style.color ? style.color : 'black'}}>{children}</Text>;

const Address = ({address, style, hideIcon}) => (
    <View style={{ flexDirection: 'row', alignItems: "center", ...style}}>
        {!hideIcon && <Icon name="location-arrow" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={20} />}
        <View style={{flex: 10}}>
            <MyText><MyText style={{fontWeight: 'bold'}}>{address.postalCode}</MyText> {address.city} {address.country}</MyText>
            <MyText>{address.address}</MyText>
            <MyText style={{fontWeight: 'bold'}}>{address.name}</MyText>
        </View>
    </View>
);

const ArrivalDate = ({date, time, style}) => (
    <View style={{flexDirection: 'row', paddingTop: 5, alignItems: "center", ...style}}>
        <Icon name={"clock-o"} style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={20}/>
        <View style={{flex: 10, flexDirection: "column"}}>
            <MyText>{moment(date).format('ll')}</MyText>
            {time && <MyText>Between {formatTime(time.start)} and {formatTime(time.end)}</MyText>}
        </View>
    </View>
);

const Packages = ({total}) => (
    <View style={{flexDirection: 'row', alignItems: "center", paddingTop: 5}}>
        <Icon name="cube" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={20} />
        <MyText style={{flex: 10}}>{total} packages</MyText>
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

const LoadDetailText = ({load, style}) =>
    <MyText style={style}>
        {load.quantity} {load.category}
        {load.description && `, ${load.description}`}
        {load.volume && `, ${load.volume} m³`}
        {load.netWeight && `, ${load.netWeight} kg`}
        {load.loadMeters && `, ${load.loadMeters} m`}
    </MyText>;

const LicensePlates = ({trailer, truck, style}) =>
    ((trailer || truck) && <View style={{flex: 1, flexDirection: "row", ...style}}>
        <View style={{flexDirection: 'row', alignItems: "center", paddingTop: 5, flex: 1}}>
            <FIcon name="truck" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={20} />
            <MyText style={{flex: 5}}>{truck}</MyText>
        </View>
        <View style={{flexDirection: 'row', alignItems: "center", paddingTop: 5, flex: 1}}>
            <FIcon name="truck" style={{flex: 1, color: 'rgb(0, 115, 209)'}} size={20} />
            <MyText style={{flex: 5}}>{trailer || "no trailer"}</MyText>
        </View>
    </View>);

export {
    MyText,
    Address,
    Packages,
    HandOverModal,
    ArrivalDate,
    LoadDetailText,
    LicensePlates
};