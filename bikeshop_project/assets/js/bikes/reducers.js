import { setBikes, setBikesFetched, setBikesIsFetching } from './actions';
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
}, { entities: {}, isFetching: false, fetched: false });
