import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFlower } from '../slices/flowersSlice';
import * as ImagePicker from 'expo-image-picker';
import { generateId, getDirectoryUrl } from '../utils';
// import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { Flower } from '../types';
import {
  NativeBaseProvider,
  Box,
  Center,
  Image,
  ScrollView,
  Heading,
  Fab,
  Icon,
  View,
  Text,
  Input,
  Button,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';

export const CreateScreen = ({
  navigation,
  route: { params },
}: NativeStackScreenProps<RootStackParamList, 'Create', 'Stack'>) => {
  const dispatch = useDispatch();
  const { flower, initImage } = params;
  const addFlower2 = (flower: Flower, image: string | undefined) => {
    console.log('newFlower', flower);
    dispatch(addFlower({ flower, image }));
  };

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
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.base64);
    }
  };

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
      };
      console.log('onSave');
      addFlower2(newFlower, image);
    } catch (exc) {
      console.log('exc');
      console.log(exc);
    }
  };

  const createFlower = async () => {
    await onSave();
    navigation.pop();
  };

  return (
    <View mt='4' mb='4'>
      <ScrollView>
        <Text>Name</Text>
        <Input value={name} placeholder='flower name' onChangeText={(name) => setName(name)} />
        {image && (
          <Center mt='3' mb='4'>
            <Image source={{ uri: `data:image/jpeg;base64,${image}` }} alt={name} size='2xl' />
          </Center>
        )}

        <Button onPress={pickImage}>Pick flower image</Button>
        <Button onPress={createFlower}>Create flower</Button>
      </ScrollView>
    </View>
  );
};
