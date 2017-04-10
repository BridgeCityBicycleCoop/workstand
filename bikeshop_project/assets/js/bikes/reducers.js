import { setBikes, setBikesFetched, setBikesIsFetching, setBikesFetchFailed, createBike, editBike, mergeBike } from './actions';
import { handleActions } from 'redux-actions';

export default handleActions({
  [setBikes]: (state, action) => ({
    ...state,
    entities: action.payload.entities.bikes,
  }),
  [setBikesIsFetching]: (state, action) => ({
    ...state,
    isFetching: action.payload,
  }),
  [setBikesFetched]: (state, action) => ({
    ...state,
    fetched: action.payload,
  }),
  [setBikesFetchFailed]: (state, action) => ({
    ...state,
    fetchFailed: {
      message: action.payload,
    },
  }),
  [editBike]: (state, action) => ({
    ...state,
    form: {
      bike: action.payload,
      create: false,
    },
  }),
  [createBike]: (state, action) => ({
    ...state,
    form: {
      bike: null,
      create: true,
    },
  }),
  [mergeBike]: (state, action) => ({
    ...state,
    entities: { ...state.entities, ...action.payload.entities.bikes },
  })
}, { entities: {}, form: { bike: null, create: undefined }, isFetching: false, fetched: false, fetchFailed: undefined });
