import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
} from 'material-ui/Toolbar';
import SizeSelect from './SizeSelect';
import StateSelect from './StateSelect';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import TextField from 'material-ui/TextField/TextField';

const Controls = ({
  setSizeFilter,
  sizeFilters,
  setStateFilter,
  stateFilters,
  resetFilters,
  handleOpenCreate,
  handleSerialSearchChange,
  serialFilter,
}) => (
  <Toolbar>
    <ToolbarGroup>
      <ToolbarTitle text="Filter" style={{ fontSize: 14 }} />
      <SizeSelect setSizeFilter={setSizeFilter} sizeFilters={sizeFilters} />
      <StateSelect
        setStateFilter={setStateFilter}
        stateFilters={stateFilters}
      />
      <TextField
        hintText="Search for serial number"
        onChange={handleSerialSearchChange}
        value={serialFilter}
        style={{ fontSize: 14 }}
      />
      <FlatButton label="reset" secondary onTouchTap={resetFilters} />
    </ToolbarGroup>
    <ToolbarGroup>
      <FontIcon className="muidocs-icon-custom-sort" />
      <ToolbarSeparator />
      <RaisedButton label="Add Bike" primary onTouchTap={handleOpenCreate} />
    </ToolbarGroup>
  </Toolbar>
);

export default Controls;
