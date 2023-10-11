import { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { useDispatch } from 'react-redux';
import { setData, setImages } from '../slices/flowersSlice';
import { Flower } from '../types';

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
        const directory = FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}`);
        console.log('directory', directory);

        const result = await FileSystem.readAsStringAsync(
          `${FileSystem.documentDirectory}data.json`,
        );
        return JSON.parse(result) as Flower[];
      } catch (ex) {
        console.log('Cannot read data.json file');
        console.log(ex);
      }
      return [];
    }

    async function readImages(data: Flower[]): Promise<Record<string, string[]>> {
      try {
        const flowerImagesPromises = data.map(async ({ directoryUrl, id }) => {
          const imagesNames = await FileSystem.readDirectoryAsync(`${directoryUrl}`);
          console.log('imagesNames', imagesNames);

          const images = await readFlowerImages(directoryUrl, imagesNames);
          return { id, images };
        });

        const images = await Promise.all(flowerImagesPromises);

        return images.reduce((agg, { id, images }) => {
          return { ...agg, [id]: images };
        }, {});
      } catch (ex) {
        console.log('Cannot read images');
        console.log(ex);
      }
      return {};
    }

    function readFlowerImages(directoryUrl: string, imageNames: string[]): Promise<string[]> {
      const imagesPromises = imageNames.map((imageName) => {
        return FileSystem.readAsStringAsync(`${directoryUrl}/${imageName}`, {
          encoding: FileSystem.EncodingType.Base64,
        });
      });

      return Promise.all(imagesPromises);
    }

    void readData();
  }, []);
}
