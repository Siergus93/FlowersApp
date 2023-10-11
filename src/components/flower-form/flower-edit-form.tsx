import React from 'react';
import { FlowerForm } from './flower-form';
import { Flower } from 'types';

export type FlowerEditFormProps = {
  currentFlower: Flower;
  images: string[];
  setCurrentFlower: (flower: Flower) => void;
  onSaveFlower: (flower: Flower, images: string[]) => Promise<void>;
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
      createFlow={false}
      currentFlower={currentFlower}
      images={images}
      onSaveFlower={onSaveFlower}
      setCurrentFlower={setCurrentFlower}
      submitButtonName='Save'
      onRemoveFlower={onRemoveFlower}
    />
  );
};
