import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Flower } from '../types';

export interface FlowersState {
    data: Flower[];
    images: Record<string, string>;
}

const initialState: FlowersState = {
    data: [],
    images: {},
}

interface ActionType {
    flower?: Flower,
    image?: string,
}

export const flowerSlice = createSlice({
    name: 'flowers',
    initialState,
    reducers: {
        addFlower: (state, { payload }: PayloadAction<ActionType>) => {
            const { flower, image } = payload;
            if(flower) {
                state.data.push(flower);
                if(image) {
                    state.images[flower.id] = image;
                }
            }
        },
        setData: (state, { payload }: PayloadAction<Flower[]>) => {
            state.data = payload;
        },
        setImages: (state, { payload }: PayloadAction<Record<string, string>>) => {
            state.images = payload;
        }
        // increment: (state) => {
        //     // Redux Toolkit allows us to write "mutating" logic in reducers. It
        //     // doesn't actually mutate the state because it uses the Immer library,
        //     // which detects changes to a "draft state" and produces a brand new
        //     // immutable state based off those changes
        //     state.value += 1;
        // },
        // decrement: (state) => {
        //     state.value -= 1;
        // },
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload;
        // },
    },
})

// Action creators are generated for each case reducer function
export const { addFlower, setData, setImages } = flowerSlice.actions;

export default flowerSlice.reducer;