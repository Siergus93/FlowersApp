import { Flower, FlowerImage } from './types';
import * as FileSystem from 'expo-file-system';
import { imagesDirectoryUrl, dataDirectoryUrl } from './constants';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

export type ResultType = {
  ok: boolean;
  error?: Error;
};

export async function saveFlowersData(flowers: Flower[]): Promise<ResultType> {
  try {
    await FileSystem.writeAsStringAsync(dataDirectoryUrl, JSON.stringify(flowers));
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error };
    }
    return { ok: false, error: new Error('Cannot save flowers data') };
  }
}

export async function createImagesDirectory(): Promise<ResultType> {
  try {
    await FileSystem.readDirectoryAsync(imagesDirectoryUrl);
    return { ok: true };
  } catch (error) {
    try {
      await FileSystem.makeDirectoryAsync(imagesDirectoryUrl);
      return { ok: true };
    } catch (error2) {
      if (error2 instanceof Error) {
        return { ok: false, error: error2 };
      }
      return { ok: false, error: new Error('Cannot create images directory') };
    }
  }
}

//to-delete
export async function createDirectoryForImage(directoryUrl: string): Promise<ResultType> {
  try {
    await FileSystem.readDirectoryAsync(directoryUrl);
    return { ok: true };
  } catch (error) {
    try {
      await FileSystem.makeDirectoryAsync(directoryUrl);
      return { ok: true };
    } catch (error2) {
      if (error2 instanceof Error) {
        return { ok: false, error: error2 };
      } else {
        return { ok: false, error: new Error('Cannot create directory for image') };
      }
    }
  }
}

export async function createImage(
  image: FlowerImage,
  directoryUrl: string,
  imageIndex: number,
): Promise<ResultType> {
  const photoUrl = `${directoryUrl}/${imageIndex}`;

  try {
    await FileSystem.readAsStringAsync(photoUrl);
    await FileSystem.deleteAsync(photoUrl);
    await FileSystem.writeAsStringAsync(photoUrl, image.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('No such file or directory')) {
        try {
          await FileSystem.writeAsStringAsync(photoUrl, image.base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } catch (error2) {
          return {
            ok: false,
            error: error2 instanceof Error ? error2 : new Error('Cannot create image'),
          };
        }
        return { ok: true };
      }
      return { ok: false, error };
    }
    return { ok: false, error: new Error('Cannot create image') };
  }
}

export async function removeFlowerImageToStorage({ directoryUrl }: Flower): Promise<ResultType> {
  try {
    await FileSystem.deleteAsync(directoryUrl);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error };
    } else {
      return { ok: false, error: new Error('Cannot remove flower image from storage') };
    }
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

export function sum(a: number, b: number): Promise<number> {
  return new Promise((resolve) => {
    resolve(a + b);
  });
}
