import { normalize, schema } from 'normalizr';

const bike = new schema.Entity('bikes');
export const bikes = new schema.Array(bike);
