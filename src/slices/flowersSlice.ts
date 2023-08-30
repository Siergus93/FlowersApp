import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Flower } from '../types';
import { saveFlowerImageToStorage, saveFlowersData } from '../utils';

export interface FlowersState {
    data: Flower[];
    images: Record<string, string>;
}

const initialState: FlowersState = {
    data: [],
    images: {},
};

interface ActionType {
    flower?: Flower;
    image?: string;
}

export const flowerSlice = createSlice({
    name: 'flowers',
    initialState,
    reducers: {
        addFlower: (state, { payload }: PayloadAction<ActionType>) => {
            const { flower, image } = payload;

            if (image && flower) {
                state.data.push(flower);
                state.images[flower.id] = image;

                Promise.all([saveFlowersData(state.data), saveFlowerImageToStorage(flower, image)])
                    .then(() => {
                        console.log('flower added, data saved');
                    })
                    .catch((ex) => {
                        console.log('something went wrong, flower not added');
                        throw ex;
                    });
            } else {
                console.log('no image or flower');
            }
        },
        editFlower: (state, { payload }: PayloadAction<ActionType>) => {
            const { flower, image } = payload;

            if (image && flower) {
                const index = state.data.findIndex((f) => f.id === flower.id);
                console.log('editFlower index', index);
                if (index !== -1) {
                    state.data[index] = flower;
                    state.images[flower.id] = image;

                    Promise.all([
                        saveFlowersData(state.data),
                        saveFlowerImageToStorage(flower, image),
                    ])
                        .then(() => {
                            console.log('flower edited, data saved');
                        })
                        .catch((ex) => {
                            console.log('something went wrong, flower not edited');
                            throw ex;
                        });
                }
            } else {
                console.log('no image or flower');
            }
        },
        setData: (state, { payload }: PayloadAction<Flower[]>) => {
            state.data = payload;
        },
        setImages: (state, { payload }: PayloadAction<Record<string, string>>) => {
            state.images = payload;
        },
    },
});

export const { addFlower, editFlower, setData, setImages } = flowerSlice.actions;

export default flowerSlice.reducer;
