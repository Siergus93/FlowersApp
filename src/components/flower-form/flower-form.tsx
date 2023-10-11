import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Flower } from '../../types';
import {
  View,
  Text,
  ScrollView,
  Input,
  Center,
  Image,
  Pressable,
  HStack,
  Switch,
  Button,
} from 'native-base';
import { FlowerDetails } from './flower-details-form';

export type FlowerFormProps = {
  createFlow: boolean;
  currentFlower: Flower;
  setCurrentFlower: (flower: Flower) => void;
  images: string[];
  onSaveFlower: (flower: Flower, images: string[]) => Promise<void>;
  onRemoveFlower?: (flower: Flower) => Promise<void>;
  submitButtonName: string;
};

export const FlowerForm = ({
  createFlow,
  currentFlower,
  setCurrentFlower,
  images,
  onSaveFlower,
  submitButtonName,
  onRemoveFlower,
}: FlowerFormProps) => {
  const [details, setDetails] = useState<boolean>(false);
  const [currentImages, setCurrentImages] = useState<string[]>(images ?? []);

  const onSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.2,
      base64: true,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].base64;
      if (newImage) {
        setCurrentImages([...currentImages, newImage]);
      }
    }
  };

  const onSave = () => {
    onSaveFlower(currentFlower, currentImages);
  };

  const onRemove = () => {
    onRemoveFlower && onRemoveFlower(currentFlower);
  };

  return (
    <View m='4'>
      <ScrollView>
        <Text>Name</Text>
        <Input
          value={currentFlower.name}
          placeholder='flower name'
          onChangeText={(name) => setCurrentFlower({ ...currentFlower, name })}
        />
        {currentImages.length > 0 && (
          <Center mt='3' mb='4'>
            {currentImages.map((img) => {
              return (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${img}` }}
                  alt={currentFlower.name}
                  h='400'
                  w='300'
                />
              );
            })}
          </Center>
        )}
        <Center mt='3' mb='4'>
          <Pressable onPress={onSelectImage}>
            <Center h='400' w='300'>
              <Text fontSize='xl'>Click here to add photo</Text>
            </Center>
          </Pressable>
        </Center>
        <HStack alignItems='center' space={4}>
          <Text>Show details</Text>
          <Switch
            value={details}
            onToggle={(details) => {
              setDetails(details);
            }}
            size='md'
          />
        </HStack>
        {details && (
          <FlowerDetails
            currentFlower={currentFlower}
            setCurrentFlower={setCurrentFlower}
          ></FlowerDetails>
        )}
        <Button onPress={onSave}>{submitButtonName}</Button>
        {onRemoveFlower && <Button onPress={onRemove}>Remove</Button>}
      </ScrollView>
    </View>
  );
};
