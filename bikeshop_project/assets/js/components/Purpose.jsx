import MenuItem from 'material-ui/MenuItem';
import React from 'react';
import SelectField from 'material-ui/SelectField';

export default class Purpose extends React.Component {
  render() {
    return (
      <SelectField
        value={this.props.default}
        onChange={this.props.handleChange.bind(this)}
        fullWidth
      >
        <MenuItem value={'VOLUNTEER'} primaryText="Volunteer" caption={'Volunteer'} />
        <MenuItem value={'FIX'} primaryText="Fix" caption={'Fix'} />
        <MenuItem value={'WORKSHOP'} primaryText="Workshop" caption={'Workshop'} />
        <MenuItem value={'DONATE'} primaryText="Donate" caption={'Donate'} />
        <MenuItem value={'STAFF'} primaryText="Staff" caption={'Staff'} />
      </SelectField>
    );
  }
}
