import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetchBikes as fetchBikesAction, setBikes, setBikesIsFetching, setBikesFetched } from './actions';
import { normalize } from 'normalizr';
import * as schema from './schema';
import Api from './services';


// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchBikes(action) {
  try {
    yield put({ type: setBikesIsFetching.toString(), payload: true });
    const bikes = yield call(Api.fetchBikes);
    yield put({ type: setBikes.toString(), payload: normalize(bikes, schema.bikes) });
    yield put({ type: setBikesFetched.toString(), payload: true });
  } catch (e) {
    yield put({ type: 'BIKES_FETCH_FAILED', message: e.message });
    throw e;
  } finally {
    yield put({ type: setBikesIsFetching.toString(), payload: false });
  }
}

function* watchFetchBikes() {
  yield takeEvery(fetchBikesAction.toString(), fetchBikes);
}

export default watchFetchBikes;
