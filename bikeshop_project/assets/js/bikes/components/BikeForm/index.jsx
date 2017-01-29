import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment-timezone';
import React from 'react';
import TextField from 'material-ui/TextField';
import Source from '../Source';
import Size from '../Size';

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

class BikeForm extends React.Component {
  constructor({ bike }) {
    super();
    this.state = {
      bike,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ bike: { ...this.state.bike, [event.target.name]: value } });
  }

  handleSizeChange(event, index, value) {
    this.setState({ bike: { ...this.state.bike, size: value } });
  }

  handleSourceChange(event, index, value) {
    this.setState({ bike: { ...this.state.bike, source: value } });
  }

  render() {
    const timezone = moment.tz.guess();
    const {
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
      stripped,
    } = this.state.bike;
    const createdAtFormatted = (moment(created_at).isValid()) ? moment(created_at).tz(timezone).fromNow() : '';
    const claimedAtFormatted = (moment(claimed_at).isValid()) ? moment(claimed_at).tz(timezone).fromNow() : '';
    const cpicSearchedAtFormatted = (moment(cpic_searched_at).isValid()) ? moment(cpic_searched_at).tz(timezone)
        .fromNow() : '';

    return (
      <div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--3-col">
            <TextField
              name="make"
              floatingLabelText="Make"
              hintText="Norco"
              value={this.state.bike.make}
              onChange={this.handleChange}
              fullWidth
              required
            />
          </div>
          <div className="mdl-cell mdl-cell--3-col">
            <TextField
              name="price"
              floatingLabelText="Price"
              hintText="35.60"
              value={this.state.bike.price}
              onChange={this.handleChange}
              fullWidth
            />
          </div>
          <div className="mdl-cell mdl-cell--3-col">
            <TextField
              name="colour"
              floatingLabelText="Colour"
              hintText="orange"
              value={this.state.bike.colour}
              onChange={this.handleChange}
              fullWidth
              required
            />
          </div>
          <div className="mdl-cell mdl-cell--3-col">
            <Size
              onChange={this.handleSizeChange}
              size={this.state.bike.size}
            />
          </div>
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col">
            <TextField
              name="serial_number"
              floatingLabelText="Serial number"
              hintText="ab90cd23"
              value={this.state.bike.serial_number}
              onChange={this.handleChange}
              fullWidth
              required
            />
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <TextField
              floatingLabelText="Created at"
              value={createdAtFormatted}
              fullWidth
              readOnly
              disabled
            />
          </div>
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col">
            <TextField
              floatingLabelText="Claimed on"
              value={claimedAtFormatted}
              fullWidth
              disabled
            />
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <TextField
              floatingLabelText="Claimed by"
              value={claimed_by}
              fullWidth
              disabled
              readonly
            />
          </div>
        </div>
        <div className="content-grid mdl-grid" style={styles.bottom}>
          <div className="mdl-cell mdl-cell--6-col">
            <TextField floatingLabelText="CPIC searched" value={cpicSearchedAtFormatted} disabled />
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            <Checkbox
              name="stolen"
              label="Stolen"
              labelPosition="left"
              style={styles.checkbox}
              checked={stolen}
              disabled
            />
          </div>
          <div className="mdl-cell mdl-cell--2-col">
            <FlatButton label="Check" primary />
          </div>
        </div>
        <div className="mdl-grid" style={styles.bottom}>
          <div className="mdl-cell mdl-cell--8-col">
            <Source
              source={source}
              onChange={this.handleSourceChange}
            />
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            <div style={styles.block}>
              <Checkbox
                checked={this.state.bike.stripped}
                name="stripped"
                label="Stripped"
                labelPosition="left"
                style={styles.checkbox}
                onCheck={this.handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BikeForm;
