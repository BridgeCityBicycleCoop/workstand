import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import BikeForm from '../BikeForm';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class BikeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      bike: undefined,
      editing: props.editing,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      ...this.state,
      open: newProps.open || false,
      bike: newProps.bike || undefined,
      editing: newProps.editing || false,
    });
  }

  handleClose() {
    this.setState({ open: false });
  };

  render() {
    const title = this.state.bike && this.state.bike.stolen ?
      (<div>
        <h3>{this.props.editing ? 'Edit Bike' : 'Add Bike'}</h3>
        <h4>STOLEN</h4>
      </div>) :
      <h3>Edit Bike</h3>;

    return (<div>
      <Dialog
        title={title}
        open={this.state.open}
        autoScrollBodyContent
      >
        { this.state.bike ?
          <BikeForm
            bike={this.state.bike}
            editing={this.state.editing}
            getBikes={this.props.getBikes}
            handleClose={this.handleClose}
          /> :
          <div>Unable to edit bike.</div>
        }
      </Dialog>
    </div>);
  }
}

BikeModal.propTypes = {
  open: PropTypes.bool,
  bike: PropTypes.object,
  editing: PropTypes.bool,
};

export default BikeModal;
