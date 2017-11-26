export const getEditBikeId = state => state.bikes.form.bike;
export const getBike = state => state.bikes.entities[getEditBikeId(state)];
