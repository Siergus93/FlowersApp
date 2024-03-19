import { Flower, FlowerImage } from '../types';
import { ResultType, createImagesDirectory, createDirectoryForImage, createImage } from '../utils';

export async function saveFlowerImageToStorage(
  { directoryUrl }: Flower,
  image: FlowerImage | undefined,
  imageIndex: number,
): Promise<ResultType> {
  const directoryCreated = await createImagesDirectory();
  if (!directoryCreated.ok) {
    return directoryCreated;
  }

  const imageForDirectoryCreated = await createDirectoryForImage(directoryUrl);
  if (!imageForDirectoryCreated.ok) {
    return imageForDirectoryCreated;
  }

  if (image) {
    const imageCreated = await createImage(image, directoryUrl, imageIndex);
    if (!imageCreated.ok) {
      return imageCreated;
    }
  }

  return { ok: true };
}
