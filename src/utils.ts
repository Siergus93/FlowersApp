import { Flower } from './types';
import * as FileSystem from 'expo-file-system';
import { imagesDirectoryUrl, dataDirectoryUrl, photoFileName } from './constants';
import { v4 as uuid } from 'uuid';

export async function saveFlowersData(flowers: Flower[]): Promise<void> {
    await FileSystem.writeAsStringAsync(dataDirectoryUrl, JSON.stringify(flowers));
}

export async function saveFlowerImageToStorage(
    { directoryUrl }: Flower,
    image: string | undefined,
): Promise<void> {
    try {
        await FileSystem.readDirectoryAsync(imagesDirectoryUrl);
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
        const photoUrl = `${directoryUrl}/${photoFileName}`;

        try {
            await FileSystem.readDirectoryAsync(directoryUrl);
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
        } catch (ex3) {
            console.log('ex3', ex3);

            if (ex3 instanceof Error) {
                if (ex3.message.includes('No such file or directory')) {
                    await FileSystem.writeAsStringAsync(photoUrl, image, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                }
            }
        }
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
