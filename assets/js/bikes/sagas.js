import { call, put, takeEvery } from 'redux-saga/effects';
import { changeState as changeStateAction, checkCpic as checkCpicAction, fetchBikes as fetchBikesAction,
         mergeBike, saveBike as saveBikeAction, setBikeIsSaving, setBikeSaveFailed, setBikeSaved,
         setBikes, setBikesFetchFailed, setBikesFetched, setBikesIsFetching, updateBike as updateBikeAction, fetchValidateState as fetchValidateStateAction } from './actions';
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
    yield put({ type: mergeBike.toString(), payload: normalize([bike], schema.bikes) });
    yield put({ type: setBikeSaved.toString(), payload: true });
  } catch (e) {
    yield put({ type: setBikeSaveFailed, payload: false });
    throw (e);
  } finally {
    yield put({ type: setBikeIsSaving.toString(), payload: false });
  }
}

function* watchUpdateBike() {
  yield takeEvery(updateBikeAction.toString(), updateBike);
}

function* saveBike(action) {
  try {
    yield put({ type: setBikeIsSaving.toString(), payload: true });
    const bike = yield call(Api.saveBike, action.payload);
    yield put({ type: mergeBike.toString(), payload: normalize([bike], schema.bikes) });
    yield put({ type: setBikeSaved.toString(), payload: true });
  } catch (e) {
    yield put({ type: setBikeSaveFailed, payload: false });
    throw (e);
  } finally {
    yield put({ type: setBikeIsSaving.toString(), payload: false });
  }
}

function* watchSaveBike() {
  yield takeEvery(saveBikeAction.toString(), saveBike);
}

function* checkCpic(action) {
  try {
    yield call(Api.cpicBike, action.payload);
  } catch (e) {
    throw (e);
  }
}

function* watchCheckCpic() {
  yield takeEvery(checkCpicAction.toString(), checkCpic);
}

function* changeState(action) {
  try {
    const { bikeId, ...rest } = action.payload;
    yield put({ type: setBikeIsSaving.toString(), payload: true });
    const bike = yield call(Api.changeState, bikeId, rest);
    yield put({ type: mergeBike.toString(), payload: normalize([bike], schema.bikes) });
    yield put({ type: setBikeSaved.toString(), payload: true });
  } catch (e) {
    throw (e);
  }
}

function* watchChangeStatus() {
  yield takeEvery(changeStateAction.toString(), changeState);
}

function* fetchValidateState(action) {
  const { bikeId, state } = action.payload;
  const asyncErrors = yield call(Api.validateState(bikeId, { state }));
  yield asyncErrors;
}

function* watchCheckValidateState() {
  yield takeEvery(fetchValidateStateAction.toString(), fetchValidateState);
}


export default function* rootSaga() {
  yield [
    watchFetchBikes(),
    watchUpdateBike(),
    watchSaveBike(),
    watchCheckCpic(),
    watchChangeStatus(),
    watchCheckValidateState(),
  ];
}
