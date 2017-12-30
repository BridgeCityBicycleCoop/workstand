import { Field, propTypes, reduxForm } from 'redux-form';
import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {
  renderCheckbox,
  renderSelectField,
  renderTextField,
  sourceMenuItems,
} from './utils';
import { saveBike, updateBike } from '../../actions';
import Api from '../../services';
import Size from '../Size';
import connect from './connect';

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

const validate = (values) => {
  const errors = {};
  const requiredFields = ['serial_number', 'colour'];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  return errors;
};

const handleSubmit = (data, dispatch, props) => {
  const { create } = props;
  if (create) {
    dispatch(saveBike(data));
  } else {
    dispatch(updateBike(data));
  }

  props.handleModalClose();
};

const asyncValidate = (values) => {
  if (values.state) {
    return Api.validateState(values.id, {
      state: values.state.toLocaleLowerCase(),
    }).then((errors) => {
      if (errors) {
        const missingFields = Object.keys(errors.field_errors).filter(
          k => !values[k],
        );

        const fieldErrors = missingFields.reduce(
          (acc, k) => ({ ...acc, [k]: errors.field_errors[k] }),
          {},
        );
        if (!isEmpty(fieldErrors)) {
          throw fieldErrors;
        }
      }
    });
  }

  return new Promise(resolve => resolve(true));
};

// handleStateSelectChange(getSelectedBike, changeBikeState, value) {
//   const data = stateActionMapper(value)
// }
const BikeFormComponent = ({
  create,
  id,
  handleSubmit,
  availableStates,
  checkCpic,
  pristine,
  submitting,
  invalid,
  handleModalClose,
  currentState,
}) => (
  <div>
    <form onSubmit={handleSubmit}>
      {availableStates && (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col">
            <Field
              name="state"
              component="select"
              floatingLabelText="State"
              fullWidth
            >
              {[
                <option value={currentState}>
                  {capitalize(currentState)}
                </option>,
              ].concat(
                availableStates.map(s => (
                  <option value={s.toLocaleUpperCase()}>{capitalize(s)}</option>
                )),
              )}
            </Field>
          </div>
        </div>
      )}
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
              floatingLabelText="Added"
              fullWidth
              readOnly
              format={value => moment(value).format('MMM Do, YYYY')}
            />
          </div>
        )}
      </div>
      {/* {!create && (
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
      )} */}
      {!create && (
        <div className="content-grid mdl-grid" style={styles.bottom}>
          <div className="mdl-cell mdl-cell--6-col">
            <Field
              name="cpic_searched_at"
              component={renderTextField}
              floatingLabelText="CPIC searched"
              readOnly
              format={value =>
                value ? moment(value).format('MMM Do, YYYY') : ''
              }
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
              onTouchTap={() => checkCpic(id)}
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
            onTouchTap={handleModalClose}
            secondary
          />
          <RaisedButton
            type="submit"
            label="Save"
            default
            disabled={pristine || submitting || invalid}
          />
        </div>
      </div>
    </form>
  </div>
);

BikeFormComponent.propTypes = {
  create: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
  checkCpic: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  ...propTypes,
};

const BikeForm = connect(
  reduxForm({
    form: 'BikeForm', // a unique identifier for this form
    validate,
    asyncValidate,
    asyncBlurFields: ['state'],
    onSubmit: handleSubmit,
  })(BikeFormComponent),
);

export default BikeForm;
