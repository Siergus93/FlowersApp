import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveFlowersData, removeFlowerImageToStorage } from '../../utils';
import { RootState } from '../../store/store';
import {
  FlowerActionNames,
  FlowerActionPayload,
  setData,
  setImages,
} from '../../store/flowersSlice';

export const removeFlower = createAsyncThunk<boolean, FlowerActionPayload, { state: RootState }>(
  FlowerActionNames.removeFlower,
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
