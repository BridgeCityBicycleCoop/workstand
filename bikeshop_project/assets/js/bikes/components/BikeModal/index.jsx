import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment-timezone';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import TextField from 'material-ui/TextField';
import Size from '../Size';
import Source from '../Source';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class BikeModal extends React.Component {
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
        stripped } = this.state.bike;
      const createdAtFormatted = moment(created_at).tz(timezone).fromNow();

      form = (
        <div>
          <TextField label={'Blah'} value={make} /><TextField label="Price" value={price} /><br />
          <TextField label="Claimed on" value={claimed_at} /><TextField label="Claimed by" value={claimed_by} /><br />
          <TextField label="Colour" value={colour} /><br />
          <TextField label="CPIC Searched on" value={cpic_searched_at} /><br />
          <TextField label="Created at" value={createdAtFormatted} readOnly disabled /><br />
          <Size size={size} />
          <TextField label="Serial number" value={serial_number} />
          <Source source={source} />
          <div style={styles.block}>
            <Checkbox
              label="Stripped"
              labelPosition="left"
              style={styles.checkbox}
              value={stripped}
            />
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
