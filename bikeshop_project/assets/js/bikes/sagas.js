import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchBikes as fetchBikesAction, setBikes, setBikesIsFetching, setBikesFetched,
         setBikesFetchFailed, setBikeSaved, setBikeSaveFailed, setBikeIsSaving, updateBike as updateBikeAction,
         mergeBike, saveBike as saveBikeAction, checkCpic as checkCpicAction } from './actions';
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
    yield put({ type: setBikesFetchFailed.toString(), payload: e.message });
    throw e;
  } finally {
    yield put({ type: setBikesIsFetching.toString(), payload: false });
  }
}

function* watchFetchBikes() {
  yield takeEvery(fetchBikesAction.toString(), fetchBikes);
}

function* updateBike(action) {
  try {
    yield put({ type: setBikeIsSaving.toString(), payload: true });
    const bike = yield call(Api.updateBike, action.payload);
    yield put({ type: mergeBike.toString(), payload: normalize([bike], schema.bikes)})
    yield put({ type: setBikeSaved.toString(), payload: true})
  } catch (e) {
    yield put({ type: setBikeSaveFailed, payload: false });
    throw(e);
  } finally {
    yield put({ type: setBikeIsSaving.toString(), payload: false });
  }
}

function* watchUpdateBike() {
  yield takeEvery(updateBikeAction.toString(), updateBike)
}

function* saveBike(action) {
  try {
    yield put({ type: setBikeIsSaving.toString(), payload: true });
    const bike = yield call(Api.saveBike, action.payload);
    yield put({ type: mergeBike.toString(), payload: normalize([bike], schema.bikes)})
    yield put({ type: setBikeSaved.toString(), payload: true})
  } catch (e) {
    yield put({ type: setBikeSaveFailed, payload: false });
    throw(e);
  } finally {
    yield put({ type: setBikeIsSaving.toString(), payload: false });
  }
}

function* watchSaveBike() {
  yield takeEvery(saveBikeAction.toString(), saveBike)
}

function* checkCpic(action) {
  try {
    yield call(Api.cpicBike, action.payload);
  } catch (e) {
    throw(e);
  }
}

function* watchCheckCpic() {
  yield takeEvery(checkCpicAction.toString(), checkCpic)
}

export default function* rootSaga() {
  yield [
    watchFetchBikes(),
    watchUpdateBike(),
    watchSaveBike(),
    watchCheckCpic(),
  ];
};
