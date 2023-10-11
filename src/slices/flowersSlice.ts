import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Flower } from '../types';
import { saveFlowerImageToStorage, saveFlowersData, removeFlowerImageToStorage } from '../utils';
import { RootState } from '../store/store';

export interface FlowersState {
  data: Flower[];
  images: Record<string, string[]>;
}

const initialState: FlowersState = {
  data: [],
  images: {},
};

type FlowerActionPayload = {
  flower: Flower | undefined;
  images: string[];
};

export const createFlower = createAsyncThunk<boolean, FlowerActionPayload, { state: RootState }>(
  'createFlower',
  async (payload, { getState, dispatch }) => {
    const { flower, images } = payload;
    const { flower: flowerState } = getState();

    if (flower) {
      const newData = [...flowerState.data, flower];
      const newImages = { ...flowerState.images, [flower.id]: images };

      dispatch(setData(newData));
      dispatch(setImages(newImages));

      await saveFlowersData(newData);

      let index = 0;
      for (const image of images) {
        await saveFlowerImageToStorage(flower, image, index);
        index++;
      }

      return true;
    } else {
      console.log('no image or flower');
      return false;
    }
  },
);

export const editFlower = createAsyncThunk<boolean, FlowerActionPayload, { state: RootState }>(
  'editFlower',
  async (payload, { getState, dispatch }) => {
    const { flower: editedFlower, images: editedImages } = payload;
    const { flower: flowerState } = getState();

    if (editedFlower) {
      const newData = flowerState.data.map((flower) => {
        return flower.id === editedFlower.id ? editedFlower : flower;
      });
      const newImages = { ...flowerState.images, [editedFlower.id]: editedImages };

      dispatch(setData(newData));
      dispatch(setImages(newImages));

      await saveFlowersData(newData);
      let index = 0;
      for (const image of editedImages) {
        await saveFlowerImageToStorage(editedFlower, image, index);
        index++;
      }
    }

    return false;
  },
);

export const removeFlower = createAsyncThunk<boolean, FlowerActionPayload, { state: RootState }>(
  'removeFlower',
  async (payload, { getState, dispatch }) => {
    const { flower: removedFlower } = payload;
    const { flower: flowerState } = getState();

    if (removedFlower) {
      const newData = [...flowerState.data];
      const flowerIndex = newData.findIndex(({ id }) => id === removedFlower.id);
      newData.splice(flowerIndex, 1);

      const newImages = { ...flowerState.images };
      delete newImages[removedFlower.id];

      dispatch(setData(newData));
      dispatch(setImages(newImages));

      await saveFlowersData(newData);
      await removeFlowerImageToStorage(removedFlower);
      return true;
    }

    return false;
  },
);

export const flowerSlice = createSlice({
  name: 'flowers',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<Flower[]>) => {
      state.data = payload;
    },
    setImages: (state, { payload }: PayloadAction<Record<string, string[]>>) => {
      state.images = payload;
    },
  },
});

export const { setData, setImages } = flowerSlice.actions;

export default flowerSlice.reducer;
