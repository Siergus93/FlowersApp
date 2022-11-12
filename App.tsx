import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  ListRenderItem,
  Pressable
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { store } from './src/store/store'
import {Provider, useDispatch, useSelector} from 'react-redux'
import type { RootState } from './src/store/store';
import { Flower } from "./src/types";
import { setData, setImages } from './src/slices/flowersSlice';
import { imagesDirectoryUrl } from './src/constants';
import { saveFlowersData, addFlowerImageToStorage, getDirectoryUrl, generateId } from './src/utils';

export type RootStackParamList = {
  Home: undefined,
  Create: {
    addFlower: (flower: Flower, image: string | undefined) => void,
    flower?: Flower,
    initImage?: string,
  },
  Settings: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();

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

const HomeScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Home', 'Stack'>) => {
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

const CreateScreen = ({ navigation, route: { params } }: NativeStackScreenProps<RootStackParamList, 'Create', 'Stack'>) => {
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

const SettingsScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Settings', 'Stack'>) => {
  const onRemoveAll = async () => {
    const folderContent = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? '');
    console.log('folderContent');
    console.log(folderContent);

    folderContent.forEach((elem) => {
      FileSystem.deleteAsync(`${FileSystem.documentDirectory}/${elem}`);
    });
    console.log("removed all");
  }

  return <View>
    <Button title='Remove all data' onPress={onRemoveAll}/>
  </View>;
}

export default function App() {
  return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Create' component={CreateScreen} />
            <Stack.Screen name='Settings' component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
  )
}
