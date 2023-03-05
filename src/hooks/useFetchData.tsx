import { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setImages } from '../slices/flowersSlice';
import { Flower } from '../types';
import { imagesDirectoryUrl } from '../constants';

export function useFetchData() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function readData() {
      const flowers = await readFlowers();
      const images = await readImages(flowers);

      dispatch(setImages(images));
      dispatch(setData(flowers));
    }

    async function readFlowers(): Promise<Flower[]> {
      try {
        const result = await FileSystem.readAsStringAsync(
          `${FileSystem.documentDirectory}data.json`,
        );
        return JSON.parse(result);
      } catch (ex) {
        console.log('Cannot read data.json file');
        console.log(ex);
      }
      return [];
    }

    async function readImages(data: Flower[]): Promise<Record<string, string>> {
      try {
        const flowerImagesPromises = data.map(async ({ directoryUrl, id }) => {
          const image = await FileSystem.readAsStringAsync(`${directoryUrl}/main.png`, {
            encoding: FileSystem.EncodingType.Base64,
          });
          return { id, image };
        });

        const images = await Promise.all(flowerImagesPromises);

        return images.reduce((agg, { id, image }) => {
          return { ...agg, [id]: image };
        }, {});
      } catch (ex) {
        console.log('Cannot read images');
        console.log(ex);
      }
      return {};
    }

    readData();
  }, []);
}
