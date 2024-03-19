import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { Flower, FlowerImage } from '../types';
import { useFetchData } from '../hooks/useFetchData/useFetchData';
import { RootStackParamList } from '../../App';
import { ScrollView, View, Fab, Icon, Button, VStack } from 'native-base';
import { removeFlowerData } from '../store/thunks/remove-flower-data.thunk';
import { AntDesign } from '@expo/vector-icons';
import { FlowerList } from '../components/flower-list';
import { AppDispatch } from '../store/store';

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home', 'Stack'>) => {
  const { height, width } = useWindowDimensions();

  useFetchData();

  const dispatch = useDispatch<AppDispatch>();

  const flowers = useSelector((state: RootState) => state.flower.data);
  const images = useSelector((state: RootState) => state.flower.images);

  const navigateToCreateScreen = (flower: Flower, images: Record<string, FlowerImage[]>) => {
    navigation.push('Create', { flower, images: images[flower.id] });
  };

  // useEffect(() => {
  //   void dispatch(removeFlowerData());
  // }, []);

  return (
    <View testID='home-screen-view' bg='emerald.100' py='10'>
      <ScrollView testID='home-screen-flowers-view' h={height - 120} w={width}>
        <FlowerList
          flowers={flowers}
          navigateToCreateScreen={navigateToCreateScreen}
          images={images}
        />
      </ScrollView>
      <VStack testID='home-screen-manage-buttons'>
        <Button
          testID='home-screen-create-button'
          onPress={() => navigation.push('Create', {})}
          bg='emerald.600'
          m='1'
        >
          Add new
        </Button>
        <Button
          testID='home-screen-delete-button'
          onPress={() => void dispatch(removeFlowerData())}
          bg='red.400'
          m='1'
        >
          Remove all
        </Button>
        {/* <Fab
          testID='home-screen-create-button'
          renderInPortal={false}
          shadow={2}
          size='sm'
          icon={<Icon color='white' as={AntDesign} name='plus' size='sm' />}
          onPress={() => navigation.push('Create', {})}
          bg='emerald.600'
        /> */}

        {/* <Fab
          testID='home-screen-delete-button'
          renderInPortal={false}
          shadow={2}
          size='sm'
          icon={<Icon color='white' as={AntDesign} name='minus' size='sm' />}
          onPress={() => void dispatch(removeFlowerData())}
          bg='red.400'
          placement='bottom-left'
        /> */}
      </VStack>
    </View>
  );
};
