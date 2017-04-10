import { connect } from 'react-redux'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import React from 'react';
import { friendlySize } from '../Size';
import BikeModal from '../BikeModal';
import { fetchBikes, setBike, editBike, createBike } from '../../actions';

class BikeTableComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bikeModal: {
        open: false,
      },
    };

    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleOpenCreate = this.handleOpenCreate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderBikes = this.renderBikes.bind(this);
  }

  componentDidMount() {
    this.props.fetchBikes();
  }

  handleOpenEdit(bike) {
    this.setState({
      ...this.state,
      bikeModal: {
        ...this.state.bikeModal,
        open: true,
      },
    });
   this.props.editBike(bike);
  }

  handleOpenCreate() {
    this.setState({
      ...this.state,
      bikeModal: {
        ...this.state.bikeModal,
        open: true,
      },
    });
   this.props.createBike();
  }

  handleClose() {
    this.setState({
      ...this.state,
      bikeModal: {
        ...this.state.bikeModal,
        open: false,
      },
    });
}

  renderBikes(bikes) {
  const bikeRows = bikes.map(bike => (
    <TableRow selectable={false} key={bike.id}>
      <TableRowColumn>{friendlySize(bike.size)}</TableRowColumn>
      <TableRowColumn>{bike.colour}</TableRowColumn>
      <TableRowColumn>{bike.make}</TableRowColumn>
      <TableRowColumn>{bike.serial_number}</TableRowColumn>
      <TableRowColumn>{bike.state}</TableRowColumn>
      <TableRowColumn>{bike.claimed_by}</TableRowColumn>
      <TableRowColumn><FlatButton label="Edit" primary onTouchTap={(e) => this.handleOpenEdit(bike)} /></TableRowColumn>
    </TableRow>
    ));

  return bikeRows;
}

  render() {
    if (this.props.bikes.fetched) {
      const bikeRows = this.renderBikes(Object.values(this.props.bikes.entities));
      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <h3>Bikes</h3>
            <FloatingActionButton onTouchTap={this.handleOpenCreate}>
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
          <BikeModal
            open={this.state.bikeModal.open}
            handleClose={this.handleClose}
          />
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  bikes: state.bikes,
});

const mapDispatchToProps = dispatch => ({
  fetchBikes: () => {
    dispatch(fetchBikes());
  },
  editBike: (bike) => {
    dispatch(editBike(bike));
  },
  createBike: () => {
    dispatch(createBike())
  }
});

const BikeTable = connect(mapStateToProps, mapDispatchToProps)(BikeTableComponent);
export default BikeTable;