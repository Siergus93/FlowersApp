import React from 'react';
import { Center, Heading, Pressable, Image } from 'native-base';
import { FlowerImage } from '../types';

export type FlowerImageProps = {
  name: string;
  image: FlowerImage;
  onImagePress: () => void;
};

export const FlowerImageComponent = ({ name, image, onImagePress }: FlowerImageProps) => {
  return (
    <Center mt='3' mb='4'>
      <Heading fontSize='xl'>{name}</Heading>
      <Pressable onPress={onImagePress}>
        <Image source={{ uri: `data:image/jpeg;base64,${image.base64}` }} alt={name} size='2xl' />
      </Pressable>
    </Center>
  );
};
