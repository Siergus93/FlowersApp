import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Flower, FlowerImage } from '../types';

export interface FlowersState {
  data: Flower[];
  images: Record<string, FlowerImage[]>;
}

export const initialState: FlowersState = {
  data: [],
  images: {},
};

export type FlowerActionPayload = {
  flower: Flower | undefined;
  images: FlowerImage[];
};

export enum FlowerActionNames {
  createFlower = 'create-flower',
  editFlower = 'edit-flower',
  removeFlower = 'remove-flower',
  removeFlowerData = 'remove-flower-data',
}

export const flowerSlice = createSlice({
  name: 'flowers',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<Flower[]>) => {
      state.data = payload;
    },
    setImages: (state, { payload }: PayloadAction<Record<string, FlowerImage[]>>) => {
      state.images = payload;
    },
  },
});

export const { setData, setImages } = flowerSlice.actions;

export default flowerSlice.reducer;
