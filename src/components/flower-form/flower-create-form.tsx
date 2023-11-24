import React from 'react';
import { FlowerForm } from '../../components/flower-form/flower-form';
import { Flower, FlowerImage } from '../../types';

export type FlowerCreateFormProps = {
  currentFlower: Flower;
  images: FlowerImage[];
  setCurrentFlower: (flower: Flower) => void;
  onSaveFlower: (flower: Flower, images: FlowerImage[]) => Promise<void>;
};

export const FlowerCreateForm = ({
  currentFlower,
  images,
  setCurrentFlower,
  onSaveFlower,
}: FlowerCreateFormProps) => {
  return (
    <FlowerForm
      currentFlower={currentFlower}
      setCurrentFlower={setCurrentFlower}
      images={images}
      onSaveFlower={onSaveFlower}
      submitButtonName='Save'
    />
  );
};
