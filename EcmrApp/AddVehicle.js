import React, {Component} from "react";
import {
    Alert,
    ScrollView,
    View
} from "react-native";
import {InputRow} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as mutations from "./graphql/mutations"
import * as EmailValidator from "email-validator";

class AddVehicle extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.getParam('editVehicle') ? I18n.get('Edit vehicle') : I18n.get('Add vehicle')
    });

    constructor(props) {
        super(props);

        const editVehicle = props.navigation.getParam("editVehicle");
        this.state = {
            companyOwner: props.navigation.getParam("companyOwner"),
            vehicleType: props.navigation.getParam("vehicleType"),
            editing: !!editVehicle,
            ...editVehicle
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{marginBottom: 50}}>
                    <View style={{backgroundColor: 'white',}}>
                        <InputRow value={this.state.licensePlateNumber} placeholder={I18n.get("e.g. 112-AA O...")}
                                  onChangeText={(licensePlateNumber) => this.setState({licensePlateNumber})}
                                  label={I18n.get("License plate")}
                                  icon={"truck"}
                                  autoCapitalize={"none"}
                                  required={true}
                        />
                        <InputRow value={this.state.description} placeholder={I18n.get("e.g. Scania 770 V8...")}
                                  onChangeText={(description) => this.setState({description})}
                                  label={I18n.get("Description")}
                                  icon={"truck"}
                                  autoCapitalize={"words"}
                                  required={true}
                        />
                    </View>
                </ScrollView>
                <Button containerStyle={{position: "absolute", start: 0, bottom: 0, end: 0}}
                        title={this.state.editing ? I18n.get("Edit vehicle") : I18n.get("Add vehicle")}
                        buttonStyle={{height: 40, backgroundColor: 'rgb(60,176,60)'}}
                        loading={this.state.loading}
                        onPress={() => this.addVehicle()}/>
            </View>
        )
    }

    async addVehicle() {
        if (!this.validate()) {
            return;
        }

        this.setState({
            loading: true
        });
        const {licensePlateNumber, description, vehicleType, companyOwner} = this.state;
        try {
            const username = (await Auth.currentAuthenticatedUser()).getUsername();
            const operation = this.state.editing ? mutations.updateVehicle : mutations.createVehicle;
            await API.graphql(graphqlOperation(operation, {
                input: {
                    ...(this.state.editing && {id: this.state.id}),
                    owner: companyOwner,
                    createdBy: username,
                    companyId: 'unused',
                    licensePlateNumber,
                    description,
                    type: vehicleType
                }
            }));
            this.finish(licensePlateNumber);
        } catch (ex) {
            console.warn(ex);
            Alert.alert(
                I18n.get('Error while adding vehicle'),
                I18n.get('You do not have permission to the vehicles.'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
        }
        this.setState({
            loading: false
        });
    }

    finish(name) {

        this.props.navigation.goBack();
    }

    validate() {
        let result = true;
        if (!this.state.licensePlateNumber) {
            Alert.alert(
                I18n.get('Required information'),
                I18n.get('Please enter the license plate number'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            result = false;
        } else if (!this.state.description) {
            Alert.alert(
                I18n.get('Required information'),
                I18n.get('Please enter a description'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            result = false;
        }

        return result;
    }
}

export default AddVehicle;