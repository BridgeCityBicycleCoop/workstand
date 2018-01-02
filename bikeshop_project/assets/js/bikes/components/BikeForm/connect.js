import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { checkCpic } from '../../actions';
import { getBike } from '../../selectors';

export default connect(
  state => ({
    initialValues: {
      ...getBike(state),
    }, // pull initial values from account reducer
    create: state.bikes.form.create,
    cpicSearched: getBike(state) ? !!getBike(state).cpic_searched_at : false,
    id: getBike(state) ? getBike(state).id : undefined,
    availableStates: getBike(state) ? getBike(state).available_states : null,
    currentState: !isEmpty(getBike(state))
      ? getBike(state).state.toLowerCase()
      : undefined,
  }),
  dispatch => ({
    checkCpic: id => dispatch(checkCpic(id)),
  }),
);
