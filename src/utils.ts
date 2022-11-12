import { Flower } from "./types";
import * as FileSystem from "expo-file-system";
import {imagesDirectoryUrl} from "./constants";
import {v4 as uuid} from "uuid";

export async function saveFlowersData(flowers: Flower[]): Promise<void> {
    await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + 'data.json',
        JSON.stringify(flowers),
    );
}

export async function addFlowerImageToStorage({id, directoryUrl}: Flower, image: string | undefined): Promise<void> {
    try {
        await FileSystem.readDirectoryAsync(imagesDirectoryUrl);
    }
    catch(ex) {
        if(ex instanceof Error) {
            if(ex.message.includes('could not be read')) {
                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}images`);
            }
        } else {
            console.log('ex');
            console.log(ex);
        }
    }
    if(image) {
        try {
            await FileSystem.makeDirectoryAsync(directoryUrl);
            await FileSystem.writeAsStringAsync(directoryUrl + "/main.png", image, {
                encoding: FileSystem.EncodingType.Base64,
            });
        }
        catch(ex2) {
            console.log('ex2');
            console.log(ex2);
        }
    }
}

export function getDirectoryUrl(id: string): string {
    return `${imagesDirectoryUrl}${id}`;
}

export function generateId(): string {
    const unique_id = uuid();
    return unique_id.slice(0,8);
}
