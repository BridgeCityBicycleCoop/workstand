import { connect } from 'react-redux'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import React from 'react';
import { friendlySize } from '../Size';
import BikeModal from '../BikeModal';
import { fetchBikes, setBike } from '../../actions';

const renderBikes = (bikes) => {
  console.log(bikes);
  const bikeRows = bikes.map(bike => (
    <TableRow selectable={false} key={bike.id}>
      <TableRowColumn>{friendlySize(bike.size)}</TableRowColumn>
      <TableRowColumn>{bike.colour}</TableRowColumn>
      <TableRowColumn>{bike.make}</TableRowColumn>
      <TableRowColumn>{bike.serial_number}</TableRowColumn>
      <TableRowColumn>{bike.state}</TableRowColumn>
      <TableRowColumn>{bike.claimed_by}</TableRowColumn>
      <TableRowColumn><FlatButton label="Edit" primary  /></TableRowColumn>
    </TableRow>
    ));
  return bikeRows;
}

class BikeTableComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bikes: [],
      bikeModal: {
        open: false,
        bike: undefined,
        editing: false,
      },
    };

    this.handleEditBike = this.handleEditBike.bind(this);
  }

  componentDidMount() {
    this.props.fetchBikes();
  }

  handleEditBike(bike) {
    this.setState({
      ...this.state,
      bikeModal: {
        open: true,
        bike,
        editing: true,
      },
    });
  }

  handleAddBike() {
    this.setState({
      ...this.state,
      bikeModal: {
        open: true,
        bike: {},
        editing: false,
      },
    });
  }

  render() {
    if (this.props.bikes.fetched) {
      const bikeRows = renderBikes(Object.values(this.props.bikes.entities['bikes'] || []));
      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <h3>Bikes</h3>
            <FloatingActionButton onTouchTap={this.handleAddBike}>
              <ContentAdd />
            </FloatingActionButton>
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
          </div>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  bikes: state.bikes.bikes,
});

const mapDispatchToProps = dispatch => ({
  fetchBikes: () => {
    dispatch(fetchBikes());
  },
  setBike: (id) => {
    dispatch(setBike(id));
  },
});

const BikeTable = connect(mapStateToProps, mapDispatchToProps)(BikeTableComponent);
export default BikeTable;