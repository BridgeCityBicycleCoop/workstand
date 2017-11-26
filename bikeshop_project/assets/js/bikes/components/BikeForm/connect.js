import { connect } from 'react-redux';
import { checkCpic } from '../../actions';

export default connect(
  state => ({
    initialValues: {
      ...state.bikes.form.bike,
    }, // pull initial values from account reducer
    create: state.bikes.form.create,
    cpicSearched: !!state.bikes.form.bike.cpic_searched_at,
    id: state.bikes.form.bike.id,
    availableStates: state.bikes.form.bike.available_states,
    currentState: state.bikes.form.bike.state.toLowerCase(),
  }),
  dispatch => ({
    checkCpic: id => dispatch(checkCpic(id)),
  }),
);
