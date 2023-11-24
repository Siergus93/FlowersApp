import React from 'react';
import { Flower, FlowerImage } from '../types';
import { FlowerImageComponent } from '../components/flower-image-component';
import { EmptyFlowerList } from '../components/empty-flower-list';
import { View } from 'native-base';

type FlowerListProps = {
  flowers: Flower[];
  navigateToCreateScreen: (flower: Flower, images: Record<string, FlowerImage[]>) => void;
  images: Record<string, FlowerImage[]>;
};

export const FlowerList = ({ flowers, navigateToCreateScreen, images }: FlowerListProps) => {
  return (
    <View testID='flower-list-container'>
      {flowers.length === 0 && <EmptyFlowerList />}
      {flowers.length > 0 &&
        flowers.map((flower) => {
          const { name, id } = flower;
          return (
            <FlowerImageComponent
              image={images[id][0]}
              name={name}
              key={id}
              onImagePress={() => navigateToCreateScreen(flower, images)}
            ></FlowerImageComponent>
          );
        })}
    </View>
  );
};
