import { generateId, createEmptyFlower, saveFlowersData } from './utils';
import { Flower } from './types';
import * as FileSystem from 'expo-file-system';
import { jest, test } from '@jest/globals';

jest.mock('expo-file-system');

//saveFlowersData
describe('function saveFlowersData', () => {
  const mockedWriteAsStringAsync = FileSystem.writeAsStringAsync as jest.MockedFunction<
    typeof FileSystem.writeAsStringAsync
  >;

  const flowers: Flower[] = [{ id: '1', name: 'Kwiatuszek', directoryUrl: 'kwiatunio01' }];

  test('test', () => {
    mockedWriteAsStringAsync.mockResolvedValue();
    expect(saveFlowersData(flowers)).toEqual(true);
    expect(mockedWriteAsStringAsync).toHaveBeenCalled();
  });
});

//createImagesDirectory
//createDirectoryForImage
//createImage
//saveFlowerImageToStorage
//removeFlowerImageToStorage

describe('function generateId', () => {
  test('generate id having 8 chars', () => {
    expect(generateId()).toHaveLength(8);
  });
});

describe('function createEmptyFlower', () => {
  test('create empty Flower', () => {
    expect(createEmptyFlower()).toStrictEqual<Flower>({
      id: '',
      name: '',
      directoryUrl: '',
      place: '',
      watering: '',
      soil: '',
      fertilization: '',
      replanting: '',
    });
  });
});
