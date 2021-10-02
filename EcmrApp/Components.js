import React from "react";
import {Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon, {default as FIcon} from "react-native-vector-icons/FontAwesome";
import {default as FIcon5} from "react-native-vector-icons/FontAwesome5";
import {Button} from "react-native-elements";
import moment from "moment/min/moment-with-locales";
import {I18n} from 'aws-amplify';

const formatTime = time => moment(time, "HH:mm").format('LT');

const MyText = ({style, children}) => <Text style={{...style, color: style && style.color ? style.color : 'black'}}>{children}</Text>;

const Address = ({address, style, hideIcon}) => (
    <View style={{ flexDirection: 'row', alignItems: "center", ...style}}>
        {!hideIcon && <Icon name="location-arrow" style={{color: 'rgb(0, 115, 209)', width: Sizes.ICON_WIDTH}} size={Sizes.ICON_WIDTH} />}
        <View style={{flex: 1, paddingLeft: 5}}>
            <MyText><MyText style={{fontWeight: 'bold'}}>{address.postalCode}</MyText> {address.city} {address.country}</MyText>
            <MyText>{address.address}</MyText>
            <MyText style={{fontWeight: 'bold'}}>{address.name}</MyText>
        </View>
    </View>
);

const ArrivalDate = ({date, time, style}) => (
    <View style={{flexDirection: 'row', paddingTop: 5, alignItems: "center", ...style}}>
        <Icon name={"clock-o"} style={{color: 'rgb(0, 115, 209)', width: Sizes.ICON_WIDTH}} size={Sizes.ICON_WIDTH}/>
        <View style={{flex: 1, paddingLeft: 5, flexDirection: "column"}}>
            <MyText>{moment(date).format('ll')}</MyText>
            {time && <MyText>{I18n.get("Between ${begin} and ${end}")
                .replace("${begin}", formatTime(time.start))
                .replace("${end}", formatTime(time.end))}</MyText>}
        </View>
    </View>
);

const Packages = ({total}) => (
    <View style={{flexDirection: 'row', alignItems: "center", paddingTop: 5}}>
        <Icon name="cube" style={{color: 'rgb(0, 115, 209)', width: Sizes.ICON_WIDTH}} size={Sizes.ICON_WIDTH} />
        <MyText style={{flex: 1, paddingLeft: 5}}>{I18n.get("${total} packages").replace("${total}", total)}</MyText>
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
                title={I18n.get("Ready")}
                onPress={onPress}/>
        </View>
    </Modal>;

// force translations
I18n.get('pallets');
I18n.get('packages');
I18n.get('roll containers');
I18n.get('bulk');
const LoadDetailText = ({load, style}) =>
    <MyText style={style}>
        {load.quantity} {I18n.get(load.category)}
        {load.description && `, ${load.description}`}
        {load.volume && `, ${load.volume} ${I18n.get('m³')}`}
        {load.netWeight && `, ${load.netWeight} ${I18n.get('kg')}`}
        {load.loadMeters && `, ${load.loadMeters} ${I18n.get('m')}`}
    </MyText>;

const LicensePlates = ({trailer, truck, style}) =>
    ((trailer || truck) && <View style={{flex: 1, flexDirection: "row", ...style}}>
        <View style={{flexDirection: 'row', alignItems: "center", paddingTop: 5}}>
            <FIcon name="truck" style={{color: 'rgb(0, 115, 209)', width: Sizes.ICON_WIDTH}} size={Sizes.ICON_WIDTH} />
            <MyText style={{paddingLeft: 5}}>{truck}</MyText>
        </View>
        <View style={{flexDirection: 'row', alignItems: "center", paddingTop: 5, marginLeft: 10}}>
            <FIcon name="truck" style={{color: 'rgb(0, 115, 209)', width: Sizes.ICON_WIDTH}} size={Sizes.ICON_WIDTH} />
            <MyText style={{paddingLeft: 5}}>{trailer || I18n.get("no trailer")}</MyText>
        </View>
    </View>);

function requiredFieldsAlert() {
    Alert.alert(
        I18n.get('Required information'),
        I18n.get('Please fill in all required fields'),
        [
            {text: I18n.get('OK')}
        ],
        {cancelable: true}
    );
}

function SelectItem({item, onSelect, onEdit, renderTitle, renderSubtitle}) {
    return (
        <TouchableOpacity onPress={onSelect}>
            <View style={{
                flexDirection: "row",
                backgroundColor: 'white',
                padding: 10,
                borderBottomColor: 'rgb(246, 246, 246)',
                borderBottomWidth: 2
            }}>
                <TouchableOpacity onPress={onEdit || onSelect}>
                    <FIcon5 size={30} style={{color: 'rgb(111, 111, 111)'}} name={"user-alt"}/>
                </TouchableOpacity>
                <View style={{marginLeft: 10}}>
                    <MyText style={{fontWeight: "bold"}}>{renderTitle(item)}</MyText>
                    <MyText style={{fontSize: 11}}>{renderSubtitle(item)}</MyText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function SelectList({data, renderTitle, renderSubtitle, emptyLabel, onSelect, onEdit, loading, style}) {
    return (
        <View style={{flex: 1}}>
            <FlatList renderItem={(dataItem) => <SelectItem onSelect={() => onSelect(dataItem)}
                                                            item={dataItem} renderTitle={renderTitle} onEdit={onEdit && (() => onEdit(dataItem))}
                                                            renderSubtitle={renderSubtitle}/>}
                      keyExtractor={(item, index) => index.toString()}
                      data={data}
                      style={style}
                      ListEmptyComponent={<MyText style={{fontWeight: "bold", padding: 20, textAlign: "center"}}>
                          {loading ? "" : emptyLabel}</MyText>}

            />
        </View>
    );
}

function InputRow({value, onChangeText, label, placeholder, icon, keyboardType, autoCapitalize, autoCompleteType, autoCorrect, required}) {
    return <View style={{
        flexDirection: "row",
        marginTop: 5,
        alignItems: "center",
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgb(200, 200, 200)"
    }}>
        <FIcon5 size={20} style={{textAlign: "center", width: 30, marginEnd: 15}} name={icon}/>
        <MyText>{label}</MyText>{required && <MyText style={{color: "red"}}>*</MyText>}
        <TextInput
            keyboardType={keyboardType || "default"}
            autoCapitalize={autoCapitalize || "none"}
            autoCompleteType={autoCompleteType || "email"}
            autoCorrect={autoCorrect || false}
            value={value}
            style={styles.textInput}
            placeholder={placeholder}
            onChangeText={onChangeText}/>
    </View>;
}

const Sizes = {
    PADDING_FROM_SCREEN_BORDER: 15,
    ICON_WIDTH: 15
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        flex: 1,
        marginLeft: 10
    },
    baseContainer: {
        flex: 1, padding: 10
    },
});

export {
    MyText,
    Address,
    Packages,
    HandOverModal,
    ArrivalDate,
    LoadDetailText,
    LicensePlates,
    Sizes,
    requiredFieldsAlert,
    SelectList,
    InputRow
};