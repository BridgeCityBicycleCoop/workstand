import React, { PropTypes } from 'react';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Size from '../Size';
import { renderCheckbox, renderSelectField, renderTextField, sourceMenuItems, stateMenuItems, getRequiredFields } from './utils';
import { updateBike, saveBike, checkCpic } from '../../actions';

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
  bottom: {
    alignItems: 'flex-end',
  },
};

const validate = (values, props) => {
  const errors = {};
  console.log(values);
  const requiredFields = getRequiredFields(values.new_state);

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  if (!props.availableStates.includes(values.new_state)) {
    errors['new_state'] = `${values.new_state} is not allowed.`;
  }
  return errors;
};

const handleSubmit = (data, dispatch, props) => {
  const { create } = props;
  if (create) {
    dispatch(saveBike(data));

  } else {
    dispatch(updateBike(data));
  }
};

class BikeForm extends React.Component {
  render() {
    const { create, cpicSearched, id, availableStates, currentState } = this.props;
    return (
      <div>
        <form onSubmit={this.props.handleSubmit}>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--3-col">
              <Field
                name="new_state"
                component={renderSelectField}
                floatingLabelText="State"
                fullWidth
              >
                {stateMenuItems([currentState].concat(availableStates))}
              </Field>
            </div>
          </div>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--3-col">
              <Field
                name="make"
                component={renderTextField}
                floatingLabelText="Make"
                hintText="Norco"
                fullWidth
              />
            </div>
            <div className="mdl-cell mdl-cell--3-col">
              <Field
                name="price"
                component={renderTextField}
                floatingLabelText="Price"
                hintText="35.60"
                fullWidth
              />
            </div>
            <div className="mdl-cell mdl-cell--3-col">
              <Field
                name="colour"
                component={renderTextField}
                floatingLabelText="Colour"
                hintText="orange"
                fullWidth
              />
            </div>
            <div className="mdl-cell mdl-cell--3-col">
              <Size />
            </div>
          </div>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--6-col">
              <Field
                name="serial_number"
                component={renderTextField}
                floatingLabelText="Serial number"
                hintText="ab90cd23"
                fullWidth
              />
            </div>
            {!create &&
              <div className="mdl-cell mdl-cell--6-col">
                <Field
                  name="created_at"
                  component={renderTextField}
                  floatingLabelText="Created at"
                  fullWidth
                  readOnly
                />
              </div>
            }
          </div>
          {!create &&
            <div className="mdl-grid">
              <div className="mdl-cell mdl-cell--6-col">
                <Field
                  name="claimed_at"
                  component={renderTextField}
                  floatingLabelText="Claimed on"
                  fullWidth
                  disabled
                />
              </div>
              <div className="mdl-cell mdl-cell--6-col">
                <Field
                  name="claimed_by"
                  component={renderTextField}
                  floatingLabelText="Claimed by"
                  fullWidth
                  disabled
                  readOnly
                />
              </div>
            </div>
          }
          {!create &&
            <div className="content-grid mdl-grid" style={styles.bottom}>
              <div className="mdl-cell mdl-cell--6-col">
                <Field
                  name="cpic_searched_at"
                  component={renderTextField}
                  floatingLabelText="CPIC searched"
                  readOnly
                />
              </div>
              <div className="mdl-cell mdl-cell--4-col">
                <Field
                  name="stolen"
                  component={renderCheckbox}
                  label="Stolen"
                  labelPosition="left"
                  style={styles.checkbox}
                  disabled
                  readOnly
                />
              </div>
              <div className="mdl-cell mdl-cell--2-col">
                <FlatButton label="Check" onTouchTap={() => this.props.checkCpic(id)} disabled={cpicSearched} primary />
              </div>
            </div>
          }
          <div className="mdl-grid" style={styles.bottom}>
            <div className="mdl-cell mdl-cell--8-col">
              <Field
                name="source"
                component={renderSelectField}
                floatingLabelText="Donation source"
                fullWidth
              >
                {sourceMenuItems}
              </Field>
            </div>
            {!create &&
              <div className="mdl-cell mdl-cell--4-col">
                <div style={styles.block}>
                  <Field
                    name="stripped"
                    label="Stripped"
                    labelPosition="left"
                    style={styles.checkbox}
                    component={renderCheckbox}
                  />
                </div>
              </div>
            }
          </div>
          <div className="mdl-grid">
            <div style={{ textAlign: 'right' }} className="mdl-cell mdl-cell--12-col">
              <RaisedButton style={{ marginRight: '8px' }} label="Cancel" onTouchTap={this.props.handleModalClose} secondary />
              <RaisedButton type="submit" label="Save" default disabled={this.props.pristine || this.props.submitting || this.props.invalid} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

BikeForm = reduxForm({
  form: 'BikeForm',  // a unique identifier for this form
  validate,
  onSubmit: handleSubmit,
})(BikeForm);

BikeForm = connect(
  state => {
    return {
      initialValues: {...state.bikes.form.bike, new_state: state.bikes.form.bike.state.toLowerCase()}, // pull initial values from account reducer
      create: state.bikes.form.create,
      cpicSearched: !!state.bikes.form.bike.cpic_searched_at,
      id: state.bikes.form.bike.id,
      availableStates: state.bikes.form.bike.available_states,
      currentState: state.bikes.form.bike.state.toLowerCase(),
    };
  },
  dispatch => ({
    checkCpic: id => dispatch(checkCpic(id)),
  }),
)(BikeForm);

BikeForm.propTypes = {
  create: PropTypes.bool,
  handleClose: PropTypes.func,
}



export default BikeForm;

