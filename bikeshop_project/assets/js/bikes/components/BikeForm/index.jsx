import React, { PropTypes } from 'react';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import Cookies from 'js-cookie';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import fetch from 'isomorphic-fetch';
import moment from 'moment-timezone';
import Source from '../Source';
import Size from '../Size';
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

const sources = ['COS_BIKE_DIVERSION_PILOT', 'UOFS', 'DROP_OFF'];

const friendly = (s) => {
  switch (s) {
    case 'COS_BIKE_DIVERSION_PILOT':
      return 'City of Saskatoon Bike Diversion Pilot';
    case 'UOFS':
      return 'University of Saskatchewan';
    case 'DROP_OFF':
      return 'Drop Off';
    default:
      return undefined;
  }
};

const sourceMenuItems = sources.map(s =>
  <MenuItem key={s} value={s} primaryText={friendly(s)} />,
);

const renderTextField = ({ input, meta: { touched, error }, ...custom }) => (
  <TextField
    errorText={touched && error}
    {...input}
    {...custom}
  />
);

const renderCheckbox = ({ input, meta, label, ...custom }) => (
  <Checkbox
    label={label}
    checked={!!input.value}
    onCheck={input.onChange}
    {...custom}
  />
);

const renderSelectField = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <SelectField
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
);

const validate = (values) => {
  const errors = {};
  const requiredFields = ['make', 'colour', 'size', 'serial_number', 'donation_source'];

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
};

class BikeForm extends React.Component {
  render() {
    const { create } = this.props;

    return (
      <div>
        <form onSubmit={this.props.handleSubmit}>
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
                  disabled
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
                  disabled
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
                <FlatButton label="Check" onTouchTap={() => this.props.checkCpic(this.props.id)} disabled={!!this.props.cpic_searched} primary />
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

const selector = formValueSelector('BikeForm')

BikeForm = connect(
  state => ({
    initialValues: state.bikes.form.bike,  // pull initial values from account reducer
    create: state.bikes.form.create,
    cpic_searched: selector(state, 'cpic_searched_at'),
    id: selector(state, 'id'),
  }),
  dispatch => ({
    checkCpic: id => dispatch(checkCpic(id)),
  }),
)(BikeForm);

BikeForm.propTypes = {
  create: PropTypes.bool,
  handleClose: PropTypes.func,
}



export default BikeForm;

