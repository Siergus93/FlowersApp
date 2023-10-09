import React from 'react';
import { FlowerForm } from './flower-form';
import { Flower } from 'types';

export type FlowerCreateFormProps = {
    currentFlower: Flower;
    images: string[];
    setCurrentFlower: (flower: Flower) => void;
    onSaveFlower: (flower: Flower, images: string[]) => Promise<void>;
};

export const FlowerCreateForm = ({
    currentFlower,
    images,
    setCurrentFlower,
    onSaveFlower,
}: FlowerCreateFormProps) => {
    return (
        <FlowerForm
            createFlow
            currentFlower={currentFlower}
            setCurrentFlower={setCurrentFlower}
            images={images}
            onSaveFlower={onSaveFlower}
            submitButtonName='Save'
        />
    );
};
