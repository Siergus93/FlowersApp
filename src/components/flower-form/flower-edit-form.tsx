import React from 'react';
import { FlowerForm } from './flower-form';
import { Flower } from 'types';

export type FlowerEditFormProps = {
    currentFlower: Flower;
    flowerImage: string | undefined;
    setCurrentFlower: (flower: Flower) => void;
    onSaveFlower: (flower: Flower, flowerImage: string | undefined) => Promise<void>;
};

export const FlowerEditForm = ({
    currentFlower,
    flowerImage,
    onSaveFlower,
    setCurrentFlower,
}: FlowerEditFormProps) => {
    return (
        <FlowerForm
            createFlow={false}
            currentFlower={currentFlower}
            flowerImage={flowerImage}
            onSaveFlower={onSaveFlower}
            setCurrentFlower={setCurrentFlower}
            submitButtonName='Edit flower'
        />
    );
};
