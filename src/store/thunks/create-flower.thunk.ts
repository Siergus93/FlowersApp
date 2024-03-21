import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveFlowersData } from '../../utils';
import { RootState } from '../../store/store';
import {
  FlowerActionNames,
  setData,
  setImages,
  FlowerActionPayload,
} from '../../store/flowersSlice';
import { saveFlowerImageToStorage } from 'utils/saveFlowerImageToStorage';

export const createFlower = createAsyncThunk<boolean, FlowerActionPayload, { state: RootState }>(
  FlowerActionNames.createFlower,
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
