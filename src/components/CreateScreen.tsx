import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFlower, editFlower, removeFlower } from '../slices/flowersSlice';
import { generateId, getDirectoryUrl, createEmptyFlower } from '../utils';
import { RootStackParamList } from '../../App';
import { Flower } from '../types';
import { FlowerCreateForm } from './flower-form/flower-create-form';
import { FlowerEditForm } from './flower-form/flower-edit-form';

export const CreateScreen = ({
    navigation,
    route: { params },
}: NativeStackScreenProps<RootStackParamList, 'Create', 'Stack'>) => {
    const dispatch = useDispatch();
    const { flower, initImage } = params;

    const newFlowerFlow = flower === undefined;
    const [currentFlower, setCurrentFlower] = useState<Flower>(flower ?? createEmptyFlower());

    const onAddFlower = async (flower: Flower, flowerImage: string | undefined): Promise<void> => {
        try {
            const id = generateId();
            const flowerToSave = {
                ...flower,
                id,
                directoryUrl: getDirectoryUrl(id),
            };

            dispatch(addFlower({ flower: flowerToSave, image: flowerImage }));
            navigation.pop();
        } catch (exc) {
            console.log('onAddFlower exc', exc);
        }
    };

    const onEditFlower = async (flower: Flower, flowerImage: string | undefined): Promise<void> => {
        try {
            dispatch(editFlower({ flower, image: flowerImage }));
            navigation.pop();
        } catch (exc) {
            console.log('onEditFlower exc', exc);
        }
    };

    const onRemoveFlower = async (flower: Flower): Promise<void> => {
        try {
            dispatch(removeFlower({ flower }));
            navigation.pop();
        } catch (exc) {
            console.log('onRemoveFlower exc', exc);
        }
    };

    return newFlowerFlow ? (
        <FlowerCreateForm
            currentFlower={currentFlower}
            flowerImage={initImage}
            setCurrentFlower={setCurrentFlower}
            onSaveFlower={onAddFlower}
        />
    ) : (
        <FlowerEditForm
            currentFlower={currentFlower}
            flowerImage={initImage}
            setCurrentFlower={setCurrentFlower}
            onSaveFlower={onEditFlower}
            onRemoveFlower={onRemoveFlower}
        />
    );
};
