import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Flower } from '../types';
import { addFlowerImageToStorage, saveFlowersData } from '../utils';

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
      console.log('adding image payload', payload);
      const { flower, image } = payload;

      if (image && flower) {
        state.data.push(flower);
        state.images[flower.id] = image;

        Promise.all([saveFlowersData(state.data), addFlowerImageToStorage(flower, image)])
          .then(() => {
            console.log('flower added, data saved');
          })
          .catch((ex) => {
            console.log('something went wrong, data not saved');
            throw ex;
          });
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

export const { addFlower, setData, setImages } = flowerSlice.actions;

export default flowerSlice.reducer;
