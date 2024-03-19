import {
  generateId,
  createEmptyFlower,
  saveFlowersData,
  createImagesDirectory,
  createImage,
  removeFlowerImageToStorage,
} from './utils';
import { Flower } from './types';
import * as FileSystem from 'expo-file-system';
import { jest, test } from '@jest/globals';

jest.mock('expo-file-system');

describe('function saveFlowersData', () => {
  const mockedWriteAsStringAsync = FileSystem.writeAsStringAsync as jest.MockedFunction<
    typeof FileSystem.writeAsStringAsync
  >;

  const flowers: Flower[] = [{ id: '1', name: 'Kwiatuszek', directoryUrl: 'kwiatunio01' }];

  test('flowers data is saved', async () => {
    mockedWriteAsStringAsync.mockResolvedValue();
    const result = await saveFlowersData(flowers);
    console.log('result', result);

    expect(result).toMatchObject({ ok: true });
    expect(mockedWriteAsStringAsync).toHaveBeenCalled();
  });

  test('flowers data is not saved', async () => {
    mockedWriteAsStringAsync.mockRejectedValue(new Error('Cannot save data'));
    expect(await saveFlowersData(flowers)).toMatchObject({ ok: false });
    expect(mockedWriteAsStringAsync).toHaveBeenCalled();
  });
});

describe('function createImagesDirectory', () => {
  const mockedReadDirectoryAsync = FileSystem.readDirectoryAsync as jest.MockedFunction<
    typeof FileSystem.readDirectoryAsync
  >;
  const mockedMakeDirectoryAsync = FileSystem.makeDirectoryAsync as jest.MockedFunction<
    typeof FileSystem.makeDirectoryAsync
  >;

  test('images directory created', async () => {
    mockedReadDirectoryAsync.mockResolvedValue([]);
    expect(await createImagesDirectory()).toMatchObject({ ok: true });
    expect(mockedReadDirectoryAsync).toHaveBeenCalled();
  });

  test('images directory exists', async () => {
    mockedReadDirectoryAsync.mockRejectedValue(new Error('Directory already exists'));
    mockedMakeDirectoryAsync.mockResolvedValue();

    expect(await createImagesDirectory()).toMatchObject({ ok: true });
    expect(mockedReadDirectoryAsync).toHaveBeenCalled();
    expect(mockedMakeDirectoryAsync).toHaveBeenCalled();
  });

  test('images directory not created', async () => {
    mockedReadDirectoryAsync.mockRejectedValue(new Error('Directory already exists'));
    mockedMakeDirectoryAsync.mockRejectedValue(new Error('Directory cannot be created'));

    expect(await createImagesDirectory()).toMatchObject({ ok: false });
    expect(mockedReadDirectoryAsync).toHaveBeenCalled();
    expect(mockedMakeDirectoryAsync).toHaveBeenCalled();
  });
});

describe('function createImage', () => {
  const mockedReadAsStringAsync = FileSystem.readAsStringAsync as jest.MockedFunction<
    typeof FileSystem.readAsStringAsync
  >;
  const mockedDeleteAsync = FileSystem.deleteAsync as jest.MockedFunction<
    typeof FileSystem.deleteAsync
  >;
  const mockedWriteAsStringAsync = FileSystem.writeAsStringAsync as jest.MockedFunction<
    typeof FileSystem.writeAsStringAsync
  >;

  test('image updated', async () => {
    mockedReadAsStringAsync.mockResolvedValue('');
    mockedDeleteAsync.mockResolvedValue();
    mockedWriteAsStringAsync.mockResolvedValue();

    expect(await createImage({ id: '0', base64: 'imageBase64' }, 'directoryUrl', 0)).toMatchObject({
      ok: true,
    });

    expect(mockedReadAsStringAsync).toHaveBeenCalled();
    expect(mockedDeleteAsync).toHaveBeenCalled();
    expect(mockedWriteAsStringAsync).toHaveBeenCalled();
  });

  test('image created', async () => {
    mockedReadAsStringAsync.mockRejectedValue(new Error('No such file or directory'));
    mockedWriteAsStringAsync.mockResolvedValue();

    expect(await createImage({ id: '0', base64: 'imageBase64' }, 'directoryUrl', 0)).toMatchObject({
      ok: true,
    });

    expect(mockedReadAsStringAsync).toHaveBeenCalled();
    expect(mockedWriteAsStringAsync).toHaveBeenCalled();
  });

  test('image not updated or not created', async () => {
    mockedReadAsStringAsync.mockRejectedValue(new Error('No such file or directory'));
    mockedWriteAsStringAsync.mockRejectedValue(new Error('Cannot create image'));

    expect(await createImage({ id: '0', base64: 'imageBase64' }, 'directoryUrl', 0)).toMatchObject({
      ok: false,
    });

    expect(mockedReadAsStringAsync).toHaveBeenCalled();
    expect(mockedWriteAsStringAsync).toHaveBeenCalled();
  });
});

describe('function removeFlowerImageToStorage', () => {
  const mockedDeleteAsync = FileSystem.deleteAsync as jest.MockedFunction<
    typeof FileSystem.deleteAsync
  >;
  const flower: Flower = {
    id: '1',
    name: 'blabla',
    directoryUrl: 'url',
  };

  test('flower image removed', async () => {
    mockedDeleteAsync.mockResolvedValue();

    expect(await removeFlowerImageToStorage(flower)).toMatchObject({ ok: true });
    expect(mockedDeleteAsync).toHaveBeenCalled();
  });

  test('flower image not removed', async () => {
    mockedDeleteAsync.mockRejectedValue(new Error('Cannot remove flower image'));

    expect(await removeFlowerImageToStorage(flower)).toMatchObject({ ok: false });
    expect(mockedDeleteAsync).toHaveBeenCalled();
  });
});

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
