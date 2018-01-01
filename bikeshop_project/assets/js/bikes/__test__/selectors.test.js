import { filterSize, getBikes } from '../selectors';
import {
  SIZE_SMALL,
  SIZE_CHILD,
  SIZE_MEDIUM,
  SIZE_LARGE,
  SIZE_XLARGE,
  SIZE_ALL,
} from '../constants';

describe('selectors', () => {
  const initialState = {
    bikes: {
      entities: {
        1: { size: SIZE_SMALL, id: 1 },
        2: { size: SIZE_CHILD, id: 2 },
        3: { size: SIZE_MEDIUM, id: 3 },
        4: { size: SIZE_LARGE, id: 4 },
        5: { size: SIZE_XLARGE, id: 5 },
      },
      filters: {
        sizes: [],
      },
    },
  };

  test('filterSize returns all', () => {
    const newState = {
      ...initialState,
      bikes: { ...initialState.bikes, filters: { sizes: [SIZE_ALL] } },
    };
    const received = filterSize(newState)(getBikes(newState));
    const expected = [
      { size: SIZE_SMALL, id: 1 },
      { size: SIZE_CHILD, id: 2 },
      { size: SIZE_MEDIUM, id: 3 },
      { size: SIZE_LARGE, id: 4 },
      { size: SIZE_XLARGE, id: 5 },
    ];

    expect(received).toEqual(expected);
  });

  test('filterSize returns medium and small', () => {
    const newState = {
      ...initialState,
      bikes: {
        ...initialState.bikes,
        filters: { sizes: [SIZE_MEDIUM, SIZE_SMALL] },
      },
    };
    const received = filterSize(newState)(getBikes(newState));
    const expected = [
      { size: SIZE_SMALL, id: 1 },
      { size: SIZE_MEDIUM, id: 3 },
    ];

    expect(received).toEqual(expected);
  });

  test('getBikes returns all bikes', () => {
    const received = getBikes(initialState);
    const expected = [
      { size: SIZE_SMALL, id: 1 },
      { size: SIZE_CHILD, id: 2 },
      { size: SIZE_MEDIUM, id: 3 },
      { size: SIZE_LARGE, id: 4 },
      { size: SIZE_XLARGE, id: 5 },
    ];

    expect(received).toEqual(expected);
  });
});
