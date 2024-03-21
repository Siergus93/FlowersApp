import * as FileSystem from 'expo-file-system';
import { Flower, FlowerImage } from '../../types';
import { generateId } from '../../utils';

export const readFlowers = async (): Promise<Flower[]> => {
  try {
    const result = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}data.json`);
    return JSON.parse(result) as Flower[];
  } catch (ex) {
    console.log('Cannot read data.json file');
    console.log(ex);
  }
  return [];
};

export const readImages = async (data: Flower[]): Promise<Record<string, FlowerImage[]>> => {
  try {
    const flowerImagesPromises = data.map(async ({ directoryUrl, id }) => {
      const imagesNames = await FileSystem.readDirectoryAsync(`${directoryUrl}`);
      const base64s = await readFlowerImages(directoryUrl, imagesNames);
      const images: FlowerImage[] = base64s.map((base64) => {
        return { base64, id: generateId() };
      });
      return { id, images };
    });

    const images = await Promise.all(flowerImagesPromises);
    const result = images.reduce<Record<string, FlowerImage[]>>((agg, { id, images }) => {
      return { ...agg, [id]: images };
    }, {});
    return result;
  } catch (ex) {
    console.log('Cannot read images');
    console.log(ex);
  }
  return {};
};

const readFlowerImages = async (directoryUrl: string, imageNames: string[]): Promise<string[]> => {
  const imagesPromises = imageNames.map(async (imageName) => {
    return FileSystem.readAsStringAsync(`${directoryUrl}/${imageName}`, {
      encoding: FileSystem.EncodingType.Base64,
    });
  });
  return Promise.all(imagesPromises);
};
