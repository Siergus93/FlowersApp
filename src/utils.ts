import { Flower, FlowerImage } from './types';
import * as FileSystem from 'expo-file-system';
import { imagesDirectoryUrl, dataDirectoryUrl } from './constants';
import { v4 as uuid } from 'uuid';

export async function saveFlowersData(flowers: Flower[]): Promise<boolean> {
  try {
    await FileSystem.writeAsStringAsync(dataDirectoryUrl, JSON.stringify(flowers));
    return true;
  } catch (ex) {
    console.log('saveFlowersData ex', ex);
    return false;
  }
}

async function createImagesDirectory(): Promise<string> {
  try {
    await FileSystem.readDirectoryAsync(imagesDirectoryUrl);
    return 'exists';
  } catch (ex) {
    await FileSystem.makeDirectoryAsync(imagesDirectoryUrl);
    return 'created';
  }
}

async function createDirectoryForImage(directoryUrl: string): Promise<string> {
  try {
    await FileSystem.readDirectoryAsync(directoryUrl);
    return 'exists';
  } catch (ex) {
    await FileSystem.makeDirectoryAsync(directoryUrl);
    return 'created';
  }
}

async function createImage(
  image: FlowerImage,
  directoryUrl: string,
  imageIndex: number,
): Promise<string> {
  const photoUrl = `${directoryUrl}/${imageIndex}`;

  try {
    await FileSystem.readAsStringAsync(photoUrl);
    await FileSystem.deleteAsync(photoUrl);
    await FileSystem.writeAsStringAsync(photoUrl, image.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return 'updated';
  } catch (ex) {
    if (ex instanceof Error) {
      if (ex.message.includes('No such file or directory')) {
        try {
          await FileSystem.writeAsStringAsync(photoUrl, image.base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } catch (ex4) {
          console.log('ex4', ex4);
        }
        return 'created';
      } else {
        console.log('createImage ex', ex);
        return 'error';
      }
    } else {
      console.log('createImage ex', ex);
      return 'error';
    }
  }
}

export async function saveFlowerImageToStorage(
  { directoryUrl }: Flower,
  image: FlowerImage | undefined,
  imageIndex: number,
): Promise<string> {
  console.log('saveFlowerImageToStorage directoryUrl', directoryUrl, 'imageIndex', imageIndex);

  try {
    await createImagesDirectory();
    await createDirectoryForImage(directoryUrl);
    if (image) {
      await createImage(image, directoryUrl, imageIndex);
    }
    return 'saved';
  } catch (ex) {
    console.log('saveFlowerImageToStorage ex', ex);
    return 'error';
  }
}

export async function removeFlowerImageToStorage({ directoryUrl }: Flower): Promise<void> {
  try {
    await FileSystem.deleteAsync(directoryUrl);
  } catch (ex) {
    console.log('removeFlowerImageToStorage ex', ex);
  }
}

export function getDirectoryUrl(id: string): string {
  return `${imagesDirectoryUrl}${id}`;
}

export function generateId(): string {
  return uuid().slice(0, 8);
}

export function createEmptyFlower(): Flower {
  return {
    id: '',
    name: '',
    directoryUrl: '',
    place: '',
    watering: '',
    soil: '',
    fertilization: '',
    replanting: '',
  };
}
