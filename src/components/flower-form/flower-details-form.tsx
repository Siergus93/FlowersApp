import React from 'react';
import { Flower } from 'types';
import { View, Text, Input, HStack, VStack } from 'native-base';

export type FlowerDetailsProps = {
    currentFlower: Flower;
    setCurrentFlower: (flower: Flower) => void;
};

export function FlowerDetails({ currentFlower, setCurrentFlower }: FlowerDetailsProps) {
    const { place, watering, soil, fertilization, replanting } = currentFlower;
    return (
        <View>
            <HStack>
                <VStack w='50%'>
                    <Text>Place</Text>
                    <Input
                        value={place}
                        placeholder='flower place'
                        onChangeText={(place) => setCurrentFlower({ ...currentFlower, place })}
                    />
                </VStack>
                <VStack w='50%'>
                    <Text>Watering</Text>
                    <Input
                        value={watering}
                        placeholder='flower watering'
                        onChangeText={(watering) =>
                            setCurrentFlower({ ...currentFlower, watering })
                        }
                    />
                </VStack>
            </HStack>
            <HStack>
                <VStack w='50%'>
                    <Text>Soil</Text>
                    <Input
                        value={soil}
                        placeholder='flower soil'
                        onChangeText={(soil) => setCurrentFlower({ ...currentFlower, soil })}
                    />
                </VStack>
                <VStack w='50%'>
                    <Text>Fertilization</Text>
                    <Input
                        value={fertilization}
                        placeholder='flower fertilization'
                        onChangeText={(fertilization) =>
                            setCurrentFlower({ ...currentFlower, fertilization })
                        }
                    />
                </VStack>
            </HStack>
            <HStack>
                <VStack w='50%'>
                    <Text>Replanting</Text>
                    <Input
                        value={replanting}
                        placeholder='flower replanting'
                        onChangeText={(replanting) =>
                            setCurrentFlower({ ...currentFlower, replanting })
                        }
                    />
                </VStack>
            </HStack>
        </View>
    );
}
