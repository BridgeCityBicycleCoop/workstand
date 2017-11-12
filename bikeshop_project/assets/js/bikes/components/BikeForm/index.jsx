import { Field, reduxForm } from 'redux-form';
import React, { PropTypes } from 'react';
import connect from './connect';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  checkCpic,
  fetchValidateState,
  saveBike,
  updateBike,
} from '../../actions';
import {
  getRequiredFields,
  renderCheckbox,
  renderSelectField,
  renderTextField,
  sourceMenuItems,
  stateMenuItems,
} from './utils';
import Size from '../Size';
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';

import Api from '../../services';

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
  // const requiredFields = getRequiredFields(values.new_state);

  // requiredFields.forEach((field) => {
  //   if (!values[field]) {
  //     errors[field] = 'Required';
  //   }
  // });

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

const stateActionMapper = memberId => ({
  claimed: { memberId },
  purchased: { memberId },
});

const asyncValidate = values => Api.validateState(values.id, { state: values.state.toLocaleLowerCase() }).then((errors) => {
  if (errors) {
    const missingFields = Object.keys(errors.field_errors).filter(k => !values[k]);

    const fieldErrors = missingFields.reduce((acc, k) => ({ ...acc, [k]: errors.field_errors[k] }), {});
    if (!isEmpty(fieldErrors))
      throw fieldErrors;
  }
});

// handleStateSelectChange(getSelectedBike, changeBikeState, value) {
//   const data = stateActionMapper(value)
// }
class BikeForm extends React.Component {
  render() {
    const {
      create,
      cpicSearched,
      id,
      availableStates,
      currentState,
    } = this.props;
    return (
      <div>
        <div className="mdl-grid">
          {/* <Field
            fullWidth
            floatingLabelText="State"
            name="state"
            component{renderSelectField}
          /> */}
        </div>
        <form onSubmit={this.props.handleSubmit}>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--6-col">
              <Field
                name="state"
                component="select"
                floatingLabelText="State"
                fullWidth
                value={this.props.state}
              >
                {
                  [<option value={this.props.state}>{capitalize(this.props.state)}</option>]
                    .concat(availableStates.map(state => <option value={state}>{capitalize(state)}</option>))}
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
            {!create && (
              <div className="mdl-cell mdl-cell--6-col">
                <Field
                  name="created_at"
                  component={renderTextField}
                  floatingLabelText="Created at"
                  fullWidth
                  readOnly
                />
              </div>
            )}
          </div>
          {!create && (
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
          )}
          {!create && (
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
                <FlatButton
                  label="Check"
                  onTouchTap={() => this.props.checkCpic(id)}
                  primary
                />
              </div>
            </div>
          )}
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
            {!create && (
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
            )}
          </div>
          <div className="mdl-grid">
            <div
              style={{ textAlign: 'right' }}
              className="mdl-cell mdl-cell--12-col"
            >
              <RaisedButton
                style={{ marginRight: '8px' }}
                label="Cancel"
                onTouchTap={this.props.handleModalClose}
                secondary
              />
              <RaisedButton
                type="submit"
                label="Save"
                default
                disabled={
                  this.props.pristine ||
                  this.props.submitting ||
                  this.props.invalid
                }
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

BikeForm = reduxForm({
  form: 'BikeForm', // a unique identifier for this form
  // validate,
  asyncValidate,
  asyncBlurFields: ['state'],
  onSubmit: handleSubmit,
})(BikeForm);

BikeForm = connect(BikeForm);

BikeForm.propTypes = {
  create: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default BikeForm;
