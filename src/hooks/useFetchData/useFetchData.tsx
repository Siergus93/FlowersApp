import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setData, setImages } from '../../store/flowersSlice';
import { readFlowers, readImages } from '../../hooks/useFetchData/utils';

export function useFetchData() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function readData() {
      const flowers = await readFlowers();
      const images = await readImages(flowers);

      dispatch(setImages(images));
      dispatch(setData(flowers));
    }

    void readData();
  }, []);
}
