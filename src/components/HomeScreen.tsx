import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import React from 'react';
import * as FileSystem from 'expo-file-system';
import { Flower } from '../types';
import { imagesDirectoryUrl, dataDirectoryUrl } from '../constants';
import { useFetchData } from '../hooks/useFetchData';
import { RootStackParamList } from '../../App';
import { Center, Image, ScrollView, Heading, View, Pressable, Button } from 'native-base';

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home', 'Stack'>) => {
  useFetchData();

  const flowers = useSelector((state: RootState) => state.flower.data);
  const images = useSelector((state: RootState) => state.flower.images);

  console.log('flowers', flowers);

  const getOnImagePress = (flower: Flower) => {
    console.log('getOnImagePress images[flower.id].length', images[flower.id].length);
    return () => {
      navigation.push('Create', { flower, images: images[flower.id] });
    };
  };

  const clearDirectory = async () => {
    try {
      await FileSystem.deleteAsync(dataDirectoryUrl, {
        idempotent: true,
      });
      await FileSystem.deleteAsync(imagesDirectoryUrl, { idempotent: true });
    } catch (ex) {
      console.log('cannot clear data', ex);
    }
  };

  return (
    <View mt='20' mb='20'>
      <ScrollView>
        {flowers.map((flower) => {
          const { name, id } = flower;
          return (
            <FlowerImage
              imgSource={images[id][0]}
              name={name}
              key={id}
              onImagePress={getOnImagePress(flower)}
            ></FlowerImage>
          );
        })}
      </ScrollView>
      <Button onPress={() => navigation.push('Create', {})}>Add</Button>
      <Button
        onPress={() => {
          clearDirectory();
        }}
      >
        Remove all
      </Button>
    </View>
  );
};

export type FlowerImageProps = {
  name: string;
  imgSource: string;
  onImagePress: () => void;
};

function FlowerImage({ name, imgSource, onImagePress }: FlowerImageProps) {
  return (
    <Center mt='3' mb='4'>
      <Heading fontSize='xl'>{name}</Heading>
      <Pressable onPress={onImagePress}>
        <Image source={{ uri: `data:image/jpeg;base64,${imgSource}` }} alt={name} size='2xl' />
      </Pressable>
    </Center>
  );
}
