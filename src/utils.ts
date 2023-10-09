import { Flower } from './types';
import * as FileSystem from 'expo-file-system';
import { imagesDirectoryUrl, dataDirectoryUrl, photoFileName } from './constants';
import { v4 as uuid } from 'uuid';

export async function saveFlowersData(flowers: Flower[]): Promise<boolean> {
    console.log('saveFlowersData');
    try {
        console.log('saveFlowersData trying to save data', flowers);
        await FileSystem.writeAsStringAsync(dataDirectoryUrl, JSON.stringify(flowers));

        const directory = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}`);
        console.log('saveFlowersData directory', directory);

        return true;
    } catch (ex) {
        console.log('saveFlowersData ex', ex);
        return false;
    }
}

export async function saveFlowerImageToStorage(
    { directoryUrl }: Flower,
    image: string | undefined,
    imageIndex: number,
): Promise<string> {
    console.log('saveFlowerImageToStorage directoryUrl', directoryUrl, 'imageIndex', imageIndex);
    try {
        console.log('imagesDirectoryUrl', imagesDirectoryUrl);
        const readDirectoryResult = await FileSystem.readDirectoryAsync(imagesDirectoryUrl);
        console.log('readDirectoryResult', readDirectoryResult);
    } catch (ex) {
        if (ex instanceof Error) {
            if (ex.message.includes('could not be read')) {
                await FileSystem.makeDirectoryAsync(imagesDirectoryUrl);
            }
        } else {
            console.log('ex');
            console.log(ex);
        }
    }

    if (image) {
        const photoUrl = `${directoryUrl}/${imageIndex}`;
        console.log('photoUrl', photoUrl);

        try {
            console.log('directoryUrl', directoryUrl);
            const photoDirectory = await FileSystem.readDirectoryAsync(directoryUrl);
            console.log('photoDirectory', photoDirectory);
        } catch (ex2) {
            if (ex2 instanceof Error) {
                if (ex2.message.includes('could not be read')) {
                    await FileSystem.makeDirectoryAsync(directoryUrl);
                }
            } else {
                console.log('ex2');
                console.log(ex2);
            }
        }
        try {
            await FileSystem.readAsStringAsync(photoUrl);
            await FileSystem.deleteAsync(photoUrl);
            await FileSystem.writeAsStringAsync(photoUrl, image, {
                encoding: FileSystem.EncodingType.Base64,
            });
            console.log('image edited', photoUrl);
        } catch (ex3) {
            console.log('ex3', ex3);

            if (ex3 instanceof Error) {
                if (ex3.message.includes('No such file or directory')) {
                    await FileSystem.writeAsStringAsync(photoUrl, image, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    console.log('image created', photoUrl);
                    return photoUrl;
                }
            }
        }
    }
    return '';
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
