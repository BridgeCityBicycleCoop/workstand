import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Purpose extends React.Component {
    render () {
        return (
            <SelectField
              value={this.props.default}
              onChange={this.props.handleChange.bind(this)}
              fullWidth={true}
              tabIndex={this.props.tabIndex}
              >
                <MenuItem value={'VOLUNTEER'} primaryText="Volunteer" />
                <MenuItem value={'FIX'} primaryText="Fix" />
                <MenuItem value={'WORKSHOP'} primaryText="Workshop" />
                <MenuItem value={'DONATE'} primaryText="Donate" />
                <MenuItem value={'STAFF'} primaryText="Staff" />
            </SelectField>
        );
    }
}
