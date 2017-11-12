import { handleActions } from 'redux-actions';
import {
  createBike,
  editBike,
  mergeBike,
  setAsyncErrors,
  setBikes,
  setBikesFetchFailed,
  setBikesFetched,
  setBikesIsFetching,
} from './actions';
// import { start } from 'repl';

export default handleActions(
  {
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
    [createBike]: state => ({
      ...state,
      form: {
        bike: null,
        create: true,
      },
    }),
    [mergeBike]: (state, action) => ({
      ...state,
      entities: { ...state.entities, ...action.payload.entities.bikes },
    }),
    [setAsyncErrors]: (state, action) => ({
      ...state,
      form: { ...state.form, asyncErrorss: action.payload },
    }),
  },
  {
    entities: {},
    form: { bike: null, create: undefined, asyncErrors: null },
    isFetching: false,
    fetched: false,
    fetchFailed: undefined,
  },
);
