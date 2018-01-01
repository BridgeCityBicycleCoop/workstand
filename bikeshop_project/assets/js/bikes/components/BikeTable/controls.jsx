import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
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
      {/* <ToolbarTitle text="Options" /> */}
      <FontIcon className="muidocs-icon-custom-sort" />
      <ToolbarSeparator />
      <RaisedButton label="Add Bike" primary onTouchTap={handleOpenCreate} />
      {/* <IconMenu
        iconButtonElement={
          <IconButton touch>
            <NavigationExpandMoreIcon />
          </IconButton>
        }
      >
        <MenuItem primaryText="Download" />
        <MenuItem primaryText="More Info" />
      </IconMenu> */}
    </ToolbarGroup>
  </Toolbar>
);

export default Controls;
