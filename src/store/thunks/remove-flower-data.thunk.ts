import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import * as FileSystem from 'expo-file-system';
import { imagesDirectoryUrl, dataDirectoryUrl } from '../../constants';
import { FlowerActionNames, setData, setImages } from '../../store/flowersSlice';

export const removeFlowerData = createAsyncThunk<boolean, void, { state: RootState }>(
  FlowerActionNames.removeFlowerData,
  async (_, { dispatch }) => {
    try {
      await FileSystem.deleteAsync(dataDirectoryUrl, {
        idempotent: true,
      });
      await FileSystem.deleteAsync(imagesDirectoryUrl, { idempotent: true });
      dispatch(setData([]));
      dispatch(setImages({}));
      return true;
    } catch (ex) {
      console.log('cannot clear data', ex);
    }
    return false;
  },
);
