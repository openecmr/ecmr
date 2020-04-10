import React, {Component} from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {MyText} from "./Components";
import {Button} from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

const options = {
    title: 'Select photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};

class AddPhotos extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: 'Add photos?'
    });

    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site"),
            photos: [
                {}, {}, {}
            ]
        };

        this.signature = this.signature.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
    }

    render() {
        return (
            <View style={styles.baseContainer}>
                <MyText style={styles.header}>E.g. photos of the load, delivery documents, etc.</MyText>

                <View style={styles.photoFrameContainer}>
                    {
                        this.state.photos.map((photo, idx) => (
                            <TouchableOpacity onPress={() => this.addPhoto(idx)} key={idx} style={styles.photoFrameClick}>
                                <View style={styles.photoFrame}>
                                    {!photo.imageSource && <Icon name={"plus"} size={40} />}
                                    {photo.imageSource && <Image source={photo.imageSource} style={styles.photo} />}
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>

                <View style={styles.alignBottom}>
                    <Button buttonStyle={{height: 60}}
                            containerStyle={{flex: 1, padding: 0}}
                            title={"Continue with signature"}
                            onPress={this.signature}/>
                </View>
            </View>
        )
    }

    addPhoto(idx) {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                if (response.fileSize > 100000) {
                    const portrait = response.height > response.width;
                    ImageResizer.createResizedImage(response.uri,
                        portrait ? response.width : 800,
                        portrait ? 600 : response.height,
                        "JPEG", 60, 0, null)
                        .then(async (response) => {
                            if (response.size > 250000) {
                                console.warn(`image still too big ${response.size}`);
                                return;
                            }
                            this.addPhotoState(response, idx);
                    }).catch((err) => {
                        console.warn(`cannot resize image ${err}`)
                    });
                } else {
                    this.addPhotoState(response, idx);
                }
            }
        });
    }

    addPhotoState(response, idx) {
        const source = {uri: response.uri};
        const photos = this.state.photos;
        photos[idx].imageSource = source;
        photos[idx].uri = response.uri;
        this.setState({
            photos
        });

    }

    signature() {
        const {navigate} = this.props.navigation;
        navigate('SignSelection', {
            item: this.state.contract,
            site: this.state.site,
            photos: this.state.photos.filter(photo => photo.uri),
        });
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 18
    },
    photoFrame: {
        marginLeft: 10,
        aspectRatio: 3 / 4,
        justifyContent: 'center',
        alignItems: "center",
        borderColor: "gray",
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 5
    },
    photoFrameContainer: {
        flexDirection: "row",
        marginTop: 20,
        flex: 1
    },
    photo: {
        height: "100%",
        width: "100%",
        borderRadius: 5
    },
    baseContainer: {
        flex: 1, padding: 10
    },
    photoFrameClick: {
        flex: 1
    },
    alignBottom: {
        flexDirection: 'row',
        margin: 10,
        marginTop: 5,
        position: 'absolute',
        bottom: 0, left: 10
    }
});

export default AddPhotos;