import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Flower } from '../types';
import { saveFlowerImageToStorage, saveFlowersData, removeFlowerImageToStorage } from '../utils';

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
        removeFlower: (state, { payload }: PayloadAction<ActionType>) => {
            const { flower: flowerToRemove } = payload;

            if (flowerToRemove) {
                const index = state.data.findIndex(({ id }) => id === flowerToRemove.id);
                state.data.splice(index, 1);
                delete state.images[flowerToRemove.id];

                Promise.all([
                    saveFlowersData(state.data),
                    removeFlowerImageToStorage(flowerToRemove),
                ])
                    .then(() => {
                        console.log('flower removed, data saved');
                    })
                    .catch((ex) => {
                        console.log('something went wrong, flower not removed');
                        throw ex;
                    });
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

export const { addFlower, editFlower, removeFlower, setData, setImages } = flowerSlice.actions;

export default flowerSlice.reducer;
