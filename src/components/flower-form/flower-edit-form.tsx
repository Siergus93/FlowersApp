import React from 'react';
import { FlowerForm } from '../../components/flower-form/flower-form';
import { Flower, FlowerImage } from '../../types';

export type FlowerEditFormProps = {
  currentFlower: Flower;
  images: FlowerImage[];
  setCurrentFlower: (flower: Flower) => void;
  onSaveFlower: (flower: Flower, images: FlowerImage[]) => Promise<void>;
  onRemoveFlower: (flower: Flower) => Promise<void>;
};

export const FlowerEditForm = ({
  currentFlower,
  images,
  onSaveFlower,
  setCurrentFlower,
  onRemoveFlower,
}: FlowerEditFormProps) => {
  return (
    <FlowerForm
      currentFlower={currentFlower}
      images={images}
      onSaveFlower={onSaveFlower}
      setCurrentFlower={setCurrentFlower}
      submitButtonName='Save'
      onRemoveFlower={onRemoveFlower}
    />
  );
};
