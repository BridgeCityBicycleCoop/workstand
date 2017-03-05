import { createAction } from 'redux-actions';

export const fetchBikes = createAction('fetch bikes');
export const setBikes = createAction('set bikes');
export const setBikesIsFetching = createAction('set bikes.isFetching');
export const setBikesFetched = createAction('set bikes.fetched');
