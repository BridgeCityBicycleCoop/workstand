import { setBike, setBikes, setBikesIsFetching, setBikesFetched } from './actions';
import { handleActions } from 'redux-actions';

export default handleActions({
  [setBikes]: (state, action) => ({
    ...state,
    bikes: action.payload,
  }),
  [setBikesIsFetching]: (state, action) => ({
    ...state,
    bikes: {
      ...state.bikes,
      isFetching: action.payload,
    },
  }),
  [setBikesFetched]: (state, action) => ({
    ...state,
    bikes: {
      ...state.bikes,
      fetched: action.payload
    }
  }),
  [setBike]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
}, { bikes: [], bike: undefined });
