import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { generateId, getDirectoryUrl, createEmptyFlower } from '../utils';
import { RootStackParamList } from '../../App';
import { Flower, FlowerImage } from '../types';
import { FlowerCreateForm } from '../components/flower-form/flower-create-form';
import { FlowerEditForm } from '../components/flower-form/flower-edit-form';
import { AppDispatch } from '../store/store';
import { createFlower } from '../store/thunks/create-flower.thunk';
import { editFlower } from '../store/thunks/edit-flower.thunk';
import { removeFlower } from '../store/thunks/remove-flower.thunk';

export const CreateScreen = ({
  navigation,
  route: { params },
}: NativeStackScreenProps<RootStackParamList, 'Create', 'Stack'>) => {
  const dispatch = useDispatch<AppDispatch>();
  const { flower, images } = params;

  const newFlowerFlow = flower === undefined;
  const [currentFlower, setCurrentFlower] = useState<Flower>(flower ?? createEmptyFlower());

  const onAddFlower = async (flower: Flower, images: FlowerImage[]): Promise<void> => {
    try {
      const id = generateId();
      const flowerToSave = {
        ...flower,
        id,
        directoryUrl: getDirectoryUrl(id),
      } satisfies Flower;

      await dispatch(createFlower({ flower: flowerToSave, images }));
      navigation.pop();
    } catch (exc) {
      console.log('onAddFlower exc', exc);
    }
  };

  const onEditFlower = async (flower: Flower, images: FlowerImage[]): Promise<void> => {
    try {
      await dispatch(editFlower({ flower, images }));
      navigation.pop();
    } catch (exc) {
      console.log('onEditFlower exc', exc);
    }
  };

  const onRemoveFlower = async (flower: Flower): Promise<void> => {
    try {
      await dispatch(removeFlower({ flower, images: [] }));
      navigation.pop();
    } catch (exc) {
      console.log('onRemoveFlower exc', exc);
    }
  };

  return newFlowerFlow ? (
    <FlowerCreateForm
      currentFlower={currentFlower}
      images={images ?? []}
      setCurrentFlower={setCurrentFlower}
      onSaveFlower={onAddFlower}
    />
  ) : (
    <FlowerEditForm
      currentFlower={currentFlower}
      images={images ?? []}
      setCurrentFlower={setCurrentFlower}
      onSaveFlower={onEditFlower}
      onRemoveFlower={onRemoveFlower}
    />
  );
};
