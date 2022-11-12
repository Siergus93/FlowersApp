import {NativeStackScreenProps} from "@react-navigation/native-stack";
import * as FileSystem from "expo-file-system";
import {Button, View} from "react-native";
import React from "react";
import {RootStackParamList} from "../../App";

export const SettingsScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Settings', 'Stack'>) => {
    const onRemoveAll = async () => {
        const folderContent = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? '');
        console.log('folderContent');
        console.log(folderContent);

        folderContent.forEach((elem) => {
            FileSystem.deleteAsync(`${FileSystem.documentDirectory}/${elem}`);
        });
        console.log("removed all");
    }

    return <View>
        <Button title='Remove all data' onPress={onRemoveAll}/>
    </View>;
}
