import values from 'lodash/values';
import curry from 'lodash/fp/curry';
import { SIZE_ALL, STATE_ALL } from './constants';


export const getEditBikeId = state => state.bikes.form.bike;
export const getBike = state => state.bikes.entities[getEditBikeId(state)];
export const getFilterSizes = state => state.bikes.filters.sizes;
export const getBikes = state => values(state.bikes.entities);
export const filterSize = curry((state, bikes) => {
  if (getFilterSizes(state).includes(SIZE_ALL)) {
    return bikes;
  }

  return bikes.filter(bike => getFilterSizes(state).includes(bike.size));
});
export const getFilterStates = state => state.bikes.filters.states;
export const filterState = curry((state, bikes) => {
  if (getFilterStates(state).includes(STATE_ALL)) {
    return bikes;
  }

  return bikes.filter(bike => getFilterStates(state).includes(bike.state));
});
export const getFilterSerial = state => state.bikes.filters.serial;
export const filterSerial = curry((state, bikes) => {
  if (!getFilterSerial(state)) {
    return bikes;
  }

  return bikes.filter(bike => bike.serial_number.includes(getFilterSerial(state)));
});
