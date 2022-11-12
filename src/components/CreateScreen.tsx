import {NativeStackScreenProps} from "@react-navigation/native-stack";
import React, {useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {generateId, getDirectoryUrl} from "../utils";
import {Button, Image, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {RootStackParamList} from "../../App";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewImage: {
        width: 75,
        height: 75,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
})

export const CreateScreen = ({ navigation, route: { params } }: NativeStackScreenProps<RootStackParamList, 'Create', 'Stack'>) => {
    const { addFlower, flower, initImage } = params;

    const [name, setName] = useState(flower?.name ?? '');
    const [place, setPlace] = useState(flower?.place ?? '');
    const [watering, setWatering] = useState(flower?.watering ?? '');
    const [soil, setSoil] = useState(flower?.soil ?? '');
    const [fertilization, setFertilization] = useState(flower?.fertilization ?? '');
    const [replanting, setReplanting] = useState(flower?.replanting ?? '');
    const [image, setImage] = useState<string | undefined>(initImage ?? '');

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            //aspect: [4, 3],
            quality: 1,
            base64: true,
        })

        if (!result.cancelled) {
            setImage(result.base64)
        }
    }

    const onSave = async () => {
        try {
            const id = generateId();
            const newFlower = {
                id,
                name,
                place,
                watering,
                soil,
                fertilization,
                replanting,
                directoryUrl: getDirectoryUrl(id),
            }
            addFlower(newFlower, image);
        } catch (exc) {
            console.log('exc')
            console.log(exc)
        }
    }

    const createFlower = async () => {
        await onSave();
        navigation.pop();
    }

    return (
        <View>
            <ScrollView>
                <Text>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    placeholder='flower name'
                    onChangeText={(name) => setName(name)}
                />
                <Text>Place</Text>
                <TextInput
                    style={styles.input}
                    value={place}
                    placeholder='flower place'
                    onChangeText={(place) => setPlace(place)}
                />
                <Text>Watering</Text>
                <TextInput
                    style={styles.input}
                    value={watering}
                    placeholder='flower watering'
                    onChangeText={(watering) => setWatering(watering)}
                />
                <Text>Soil</Text>
                <TextInput
                    style={styles.input}
                    value={soil}
                    placeholder='flower soil'
                    onChangeText={(soil) => setSoil(soil)}
                />
                <Text>Fertilization</Text>
                <TextInput
                    style={styles.input}
                    value={fertilization}
                    placeholder='flower fertilization'
                    onChangeText={(fertilization) => setFertilization(fertilization)}
                />
                <Text>Replanting</Text>
                <TextInput
                    style={styles.input}
                    value={replanting}
                    placeholder='flower replanting'
                    onChangeText={(replanting) => setReplanting(replanting)}
                />
                {image && (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${image}` }}
                        style={{ width: 200, height: 200 }}
                    />
                )}
                <Button title='Pick flower image' onPress={pickImage} />
                <Button title='Create flower' onPress={createFlower} />
            </ScrollView>
        </View>
    )
}
