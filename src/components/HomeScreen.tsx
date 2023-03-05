import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import React, { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { Flower } from '../types';
import { imagesDirectoryUrl } from '../constants';
import { setData, setImages } from '../slices/flowersSlice';
import { addFlowerImageToStorage, saveFlowersData } from '../utils';
import { useFetchData } from '../hooks/useFetchData';
// import {Button, FlatList, Image, ListRenderItem, Pressable, Text, View, StyleSheet, Dimensions} from "react-native";
// import {Image}from "react-native";
import { RootStackParamList } from '../../App';
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
  Pressable,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';

export const HomeScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Home', 'Stack'>) => {
  useFetchData();

  const flowers = useSelector((state: RootState) => state.flower.data);
  const images = useSelector((state: RootState) => state.flower.images);

  const getOnImagePress = (flower: Flower) => {
    return () => {
      navigation.push('Create', { flower, initImage: images[flower.id] });
    };
  };

  return (
    <View mt='4' mb='4'>
      <ScrollView>
        {flowers.map((flower) => {
          const { name, id } = flower;
          return (
            <FlowerImage
              imgSource={images[id]}
              name={name}
              key={id}
              onImagePress={getOnImagePress(flower)}
            ></FlowerImage>
          );
        })}
      </ScrollView>
      <Fab
        renderInPortal={false}
        shadow={2}
        size='sm'
        icon={<Icon color='white' as={AntDesign} name='plus' size='sm' />}
        onPress={() => navigation.push('Create', {})}
      />
    </View>
  );
};

export type FlowerImageProps = {
  name: string;
  imgSource: string;
  onImagePress: () => void;
};

function FlowerImage({ name, imgSource, onImagePress }: FlowerImageProps) {
  // const onImagePress = async (flower: Flower) => {
  //   navigation.push('Create', { flower, initImage: images[flower.id] });
  // };
  return (
    <Center mt='3' mb='4'>
      <Heading fontSize='xl'>{name}</Heading>
      <Pressable onPress={onImagePress}>
        <Image source={{ uri: `data:image/jpeg;base64,${imgSource}` }} alt={name} size='2xl' />
      </Pressable>
    </Center>
  );
}
