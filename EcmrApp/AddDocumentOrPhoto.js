import React, {Component} from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {MyText} from "./Components";
import {Button} from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {Auth, I18n} from "aws-amplify";
import AddPhotos from "./AddPhotos";
import moment from "moment/min/moment-with-locales";
import {createUpdateContractInput, updateContract, uploadPhotos} from "./DataUtil";

class AddDocumentOrPhoto extends AddPhotos {
    constructor(props) {
        super(props);
    }

    buttonTitle() {
        return I18n.get("Save");
    }

    attachmentMode() {
        return true;
    }

    async finish() {
        this.setState({
            loading: true
        });
        const photos = this.state.photos.filter(photo => photo.uri);
        const now = moment().format();
        const user = await Auth.currentAuthenticatedUser();

        const photoObjects = await uploadPhotos(photos);

        const attachmentDescription = this.state.attachmentDescription;
        const event = {
            type: 'AddAttachment',
            createdAt: now,
            author: {
                username: user.username
            },

            attachments: photoObjects.map((p, i) => ({
                location: p,
                size: photos[i].size,
                filename: photos[i].timestamp + ".jpg",
                mimeType: "image/jpeg",
                extension: "jpg"
            })),
            ...(attachmentDescription && {attachmentDescription}),
            attachmentType: "OTHER"
        };
        const update = createUpdateContractInput(this.state.contract);
        update.events.push(event);
        const finalContract = await updateContract(update);
        this.props.navigation.pop();
    }
}

export default AddDocumentOrPhoto;