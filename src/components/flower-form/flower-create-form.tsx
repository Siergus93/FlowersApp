import React from 'react';

import { FlowerForm } from './flower-form';
import { Flower } from 'types';

export type FlowerCreateFormProps = {
    currentFlower: Flower;
    flowerImage: string | undefined;
    setCurrentFlower: (flower: Flower) => void;
    onSaveFlower: (flower: Flower, flowerImage: string | undefined) => Promise<void>;
};

export const FlowerCreateForm = ({
    currentFlower,
    flowerImage,
    setCurrentFlower,
    onSaveFlower,
}: FlowerCreateFormProps) => {
    return (
        <FlowerForm
            createFlow
            currentFlower={currentFlower}
            setCurrentFlower={setCurrentFlower}
            flowerImage={flowerImage}
            onSaveFlower={onSaveFlower}
            submitButtonName='Create flower'
        />
    );
};
