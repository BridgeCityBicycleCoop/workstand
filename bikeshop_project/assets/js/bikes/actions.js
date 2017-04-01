import { createAction } from 'redux-actions';

export const fetchBikes = createAction('fetch bikes');
export const setBikes = createAction('set bikes');
export const setBikesIsFetching = createAction('set bikes.isFetching');
export const setBikesFetched = createAction('set bikes.fetched');
export const setBikesFetchFailed = createAction('set bikes.fetchFailed');
export const setBikeSaved = createAction('set bike.saved');
export const setBikeIsSaving = createAction('set bike.isSaving');
export const setBikeSaveFailed = createAction('set bike.isSaving');