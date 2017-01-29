import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment-timezone';
import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

import Source from '../Source';
import Size from '../Size';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class BikeModal extends React.Component {
  static propTypes = {
    open: PropTypes.boolean,
  }

  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      bike: undefined,
    };
  }
  componentWillReceiveProps(newProps) {
    this.setState({ open: newProps.open || false, bike: newProps.bike || false });
  }
  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
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

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        disabled
        onTouchTap={this.handleClose}
      />,
    ];

    let form;


    if (this.state.bike !== undefined) {
      const timezone = moment.tz.guess();
      const {
        make,
        price,
        claimed_at,
        claimed_by,
        colour,
        cpic_searched_at,
        created_at,
        size,
        serial_number,
        source,
        stolen,
        stripped } = this.state.bike;
      const createdAtFormatted = (moment(created_at).isValid()) ? moment(created_at).tz(timezone).fromNow() : '';
      const claimedAtFormatted = (moment(claimed_at).isValid()) ? moment(claimed_at).tz(timezone).fromNow() : '';
      const cpicSearchedAtFormatted = (moment(cpic_searched_at).isValid()) ? moment(cpic_searched_at).tz(timezone)
          .fromNow() : '';

      form = (
        <div>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--3-col">
              <TextField floatingLabelText="Make" hintText="Norco" value={make} fullWidth required />
            </div>
            <div className="mdl-cell mdl-cell--3-col">
              <TextField floatingLabelText="Price" hintText="35.60" value={price} fullWidth />
            </div>
            <div className="mdl-cell mdl-cell--3-col">
              <TextField floatingLabelText="Colour" hintText="orange" value={colour} fullWidth required />
            </div>
            <div className="mdl-cell mdl-cell--3-col">
              <Size size={size} />
            </div>
          </div>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--6-col">
              <TextField floatingLabelText="Serial number" hintText="ab90cd23" value={serial_number}
                         fullWidth required />
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <TextField floatingLabelText="Created at" value={createdAtFormatted} fullWidth readOnly disabled />
            </div>
          </div>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--6-col">
              <TextField floatingLabelText="Claimed on" value={claimedAtFormatted} fullWidth disabled />
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <TextField floatingLabelText="Claimed by" value={claimed_by} fullWidth />
            </div>
          </div>
          <div className="content-grid mdl-grid" style={styles.bottom}>
            <div className="mdl-cell mdl-cell--6-col">
              <TextField floatingLabelText="CPIC searched" value={cpicSearchedAtFormatted} disabled />
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <Checkbox
                label="Stolen"
                labelPosition="left"
                style={styles.checkbox}
                value={stolen}
                disabled
              />
            </div>
          </div>
          <div className="mdl-grid" style={styles.bottom}>
            <div className="mdl-cell mdl-cell--8-col">
              <Source source={source} />
            </div>
            <div className="mdl-cell mdl-cell--4-col">
              <div style={styles.block}>
                <Checkbox
                  label="Stripped"
                  labelPosition="left"
                  style={styles.checkbox}
                  value={stripped}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (<div>
      <Dialog
        title="Edit Bike"
        actions={actions}
        modal
        open={this.state.open}
      >
        {form || <div>Unable to edit bike.</div>}

      </Dialog>
    </div>);
  }
}
