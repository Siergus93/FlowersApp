import { saveFlowerImageToStorage } from './saveFlowerImageToStorage';
import { createImagesDirectory, createImage, createDirectoryForImage } from '../utils';
import { jest, test } from '@jest/globals';
import { Flower } from '../types';

jest.mock('../utils');

describe('function saveFlowerImageToStorage', () => {
  const mockCreateImageDirectory = createImagesDirectory as jest.MockedFunction<
    typeof createImagesDirectory
  >;
  const mockCreateDirectoryForImage = createDirectoryForImage as jest.MockedFunction<
    typeof createDirectoryForImage
  >;
  const mockCreateImage = createImage as jest.MockedFunction<typeof createImage>;

  const flower: Flower = {
    id: '1',
    name: 'blabla',
    directoryUrl: 'url',
  };

  test('flower image saved to storage', async () => {
    mockCreateImageDirectory.mockResolvedValue({ ok: true });
    mockCreateDirectoryForImage.mockResolvedValue({ ok: true });
    mockCreateImage.mockResolvedValue({ ok: true });

    expect(await saveFlowerImageToStorage(flower, { id: '1', base64: '' }, 1)).toMatchObject({
      ok: true,
    });

    expect(mockCreateImageDirectory).toHaveBeenCalled();
    expect(mockCreateDirectoryForImage).toHaveBeenCalled();
    expect(mockCreateImage).toHaveBeenCalled();
  });

  test('flower image saved to storage - image undefined', async () => {
    mockCreateImageDirectory.mockResolvedValue({ ok: true });
    mockCreateDirectoryForImage.mockResolvedValue({ ok: true });

    expect(await saveFlowerImageToStorage(flower, undefined, 1)).toMatchObject({
      ok: true,
    });

    expect(mockCreateImageDirectory).toHaveBeenCalled();
    expect(mockCreateDirectoryForImage).toHaveBeenCalled();
    expect(mockCreateImage).not.toHaveBeenCalled();
  });

  test('flower image not saved - cannot create image directory', async () => {
    mockCreateImageDirectory.mockResolvedValue({ ok: false });

    expect(await saveFlowerImageToStorage(flower, { id: '1', base64: '' }, 1)).toMatchObject({
      ok: false,
    });

    expect(mockCreateImageDirectory).toHaveBeenCalled();
    expect(mockCreateDirectoryForImage).not.toHaveBeenCalled();
    expect(mockCreateImage).not.toHaveBeenCalled();
  });

  test('flower image not saved - cannot create directory for image', async () => {
    mockCreateImageDirectory.mockResolvedValue({ ok: true });
    mockCreateDirectoryForImage.mockResolvedValue({ ok: false });

    expect(await saveFlowerImageToStorage(flower, { id: '1', base64: '' }, 1)).toMatchObject({
      ok: false,
    });

    expect(mockCreateImageDirectory).toHaveBeenCalled();
    expect(mockCreateDirectoryForImage).toHaveBeenCalled();
    expect(mockCreateImage).not.toHaveBeenCalled();
  });

  test('flower image not saved - cannot create image', async () => {
    mockCreateImageDirectory.mockResolvedValue({ ok: true });
    mockCreateDirectoryForImage.mockResolvedValue({ ok: true });
    mockCreateImage.mockResolvedValue({ ok: false });

    expect(await saveFlowerImageToStorage(flower, { id: '1', base64: '' }, 1)).toMatchObject({
      ok: false,
    });

    expect(mockCreateImageDirectory).toHaveBeenCalled();
    expect(mockCreateDirectoryForImage).toHaveBeenCalled();
    expect(mockCreateImage).toHaveBeenCalled();
  });
});
