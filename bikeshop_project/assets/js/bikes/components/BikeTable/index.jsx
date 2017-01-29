import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Cookies from 'js-cookie';
import fetch from 'isomorphic-fetch';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import { friendlySize } from '../Size';
import BikeModal from '../BikeModal';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

export default class BikeTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bikes: [],
      bikeModal: {
        open: false,
        bike: undefined,
      },
    };

    this.handleEditBike = this.handleEditBike.bind(this);
  }

  componentDidMount() {

    fetch('/api/v1/bikes/', {
      credentials: 'same-origin',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        this.setState({ bikes: data });
        console.log('request succeeded with JSON response', data);
      })
      .catch((error) => {
        console.log('request failed', error);
      });
  }

  handleEditBike(bike) {
    console.log('Bike edit!');
    this.setState({
      ...this.state,
      bikeModal: {
        open: true,
        bike,
      },
    });
  }

  render() {
    const bikeRows = this.state.bikes.map(bike => (
      <TableRow selectable={false} key={bike.id}>
        <TableRowColumn>{friendlySize(bike.size)}</TableRowColumn>
        <TableRowColumn>{bike.colour}</TableRowColumn>
        <TableRowColumn>{bike.make}</TableRowColumn>
        <TableRowColumn>{bike.serial_number}</TableRowColumn>
        <TableRowColumn>{bike.state}</TableRowColumn>
        <TableRowColumn>{bike.claimed_by}</TableRowColumn>
        <TableRowColumn><FlatButton label="Edit" primary onTouchTap={this.handleEditBike.bind(null, bike)} /></TableRowColumn>
      </TableRow>
      ));

    return (
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--12-col">
          <h3>Bikes</h3>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Size</TableHeaderColumn>
                <TableHeaderColumn>Colour</TableHeaderColumn>
                <TableHeaderColumn>Make</TableHeaderColumn>
                <TableHeaderColumn>Serial number</TableHeaderColumn>
                <TableHeaderColumn>State</TableHeaderColumn>
                <TableHeaderColumn>Claimed by</TableHeaderColumn>
                <TableRowColumn />
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {bikeRows.length ?
              bikeRows :
              <TableRow >
                <TableRowColumn key="none">{'No bikes found.'}</TableRowColumn>
              </TableRow>
            }
            </TableBody>
          </Table>
          <BikeModal bike={this.state.bikeModal.bike} open={this.state.bikeModal.open} />
        </div>
      </div>
    );
  }
}
