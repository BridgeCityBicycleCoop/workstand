import { connect } from 'react-redux';
import { checkCpic } from '../../actions';
import { getBike } from '../../selectors';

export default connect(
  state => ({
    initialValues: {
      ...getBike(state),
    }, // pull initial values from account reducer
    create: state.bikes.form.create,
    cpicSearched: !!getBike(state).cpic_searched_at,
    id: getBike(state).id,
    availableStates: getBike(state).available_states,
    currentState: getBike(state).state.toLowerCase(),
  }),
  dispatch => ({
    checkCpic: id => dispatch(checkCpic(id)),
  }),
);
