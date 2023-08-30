import { Flower } from './types';
import * as FileSystem from 'expo-file-system';
import { imagesDirectoryUrl } from './constants';
import { v4 as uuid } from 'uuid';

export async function saveFlowersData(flowers: Flower[]): Promise<void> {
    await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + 'data.json',
        JSON.stringify(flowers),
    );
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
                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}images`);
            }
        } else {
            console.log('ex');
            console.log(ex);
        }
    }

    if (image) {
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
            await FileSystem.readAsStringAsync(directoryUrl + '/main.png');
            await FileSystem.deleteAsync(directoryUrl + '/main.png');
        } catch (ex3) {
            console.log('ex3', ex3);

            if (ex3 instanceof Error) {
                if (ex3.message.includes('No such file or directory')) {
                    console.log('writing file');
                    await FileSystem.writeAsStringAsync(directoryUrl + '/main.png', image, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                }
            }
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
