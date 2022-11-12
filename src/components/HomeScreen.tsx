import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/store";
import React, {useEffect} from "react";
import * as FileSystem from "expo-file-system";
import {Flower} from "../types";
import {imagesDirectoryUrl} from "../constants";
import {setData, setImages} from "../slices/flowersSlice";
import {addFlowerImageToStorage, saveFlowersData} from "../utils";
import {Button, FlatList, Image, ListRenderItem, Pressable, Text, View} from "react-native";
import {RootStackParamList} from "../../App";

export const HomeScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Home', 'Stack'>) => {
    const dispatch = useDispatch();
    const flowers = useSelector((state: RootState) => state.flower.data);
    const images = useSelector((state: RootState) => state.flower.images);

    useEffect(() => {
        FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}data.json`).then(async (result) => {
            const flowersData = JSON.parse(result) as Flower[];
            const imagesDir = await FileSystem.readDirectoryAsync(imagesDirectoryUrl);
            console.log('imagesDir');
            console.log(imagesDir);

            let flowerImages = {};
            const flowerImagesPromises = flowersData.map(async ({directoryUrl, id}) => {
                const image = await FileSystem.readAsStringAsync(`${directoryUrl}/main.png`, {encoding: FileSystem.EncodingType.Base64});
                return {id, image};
            });
            Promise.all(flowerImagesPromises).then((result) => {
                result.forEach(({id, image}) => {
                    console.log('id: ' + id);
                    flowerImages = {...flowerImages, [id]: image};
                });
                dispatch(setImages(flowerImages));
            }).catch((ex4) => {
                console.log('could not get images data');
                console.log(ex4);
            })

            dispatch(setData(flowersData));
        }).catch((ex3) => {
            console.log('could not get flowers data');
            console.log(ex3);
        });
    }, []);

    const addFlower = (flower: Flower, image: string | undefined): void => {
        if(image) {
            const newFlowers = [...flowers, flower];
            Promise.all([saveFlowersData(newFlowers), addFlowerImageToStorage(flower, image)]).then(() => {
                console.log('flower added, data saved');
                dispatch(setData(newFlowers));
                dispatch(setImages({...images, [flower.id]: image}));
            }).catch((ex) => {
                console.log(ex);
            });
        } else {
            console.log('no image');
        }
    };

    const onImagePress = async (flower: Flower) => {
        navigation.push('Create', { addFlower, flower, initImage: images[flower.id] });
    };

    const renderItem: ListRenderItem<Flower> = ({item}) => {
        const image = images[item.id];
        return <View>
            {image &&
                <Pressable onPress={() => onImagePress(item)}>
                    <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={{ width: 200, height: 200 }}
                    /></Pressable>}
            <Text>{item.name}</Text>
        </View>
    }

    return (
        <View>
            <Button title='Add flower' onPress={() => navigation.push('Create', { addFlower })} />
            <Button title='Go to settings' onPress={() => navigation.push('Settings')}/>
            <Button title='Log flowers' onPress={() => {
                console.log('flowers');
                console.log(flowers);
                console.log('images');
                console.log(images);
            }}/>
            <FlatList data={flowers} renderItem={renderItem} keyExtractor={item => item.id}></FlatList>
        </View>
    );
}
