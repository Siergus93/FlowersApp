import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveFlowerImageToStorage, saveFlowersData } from '../../utils';
import { RootState } from '../../store/store';
import {
  FlowerActionNames,
  FlowerActionPayload,
  setData,
  setImages,
} from '../../store/flowersSlice';

export const editFlower = createAsyncThunk<boolean, FlowerActionPayload, { state: RootState }>(
  FlowerActionNames.editFlower,
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
