import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import BikeForm from '../BikeForm';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class BikeModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    editing: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      bike: undefined,
      editing: props.editing,
    };
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
      ...this.state,
      open: newProps.open || false,
      bike: newProps.bike || undefined,
      editing: newProps.editing || false,
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
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

    const title = this.state.bike && this.state.bike.stolen ?
      (<div>
        <h3>{this.props.editing ? 'Edit Bike' : 'Add Bike'}</h3>
        <h4>STOLEN</h4>
      </div>) :
      <h3>Edit Bike</h3>;

    return (<div>
      <Dialog
        title={title}
        actions={actions}
        modal
        open={this.state.open}
        autoScrollBodyContent
      >
        { this.state.bike ?
          <BikeForm
            bike={this.state.bike}
            editing={this.state.editing}
            getBikes={this.props.getBikes}
          /> :
          <div>Unable to edit bike.</div>
        }
      </Dialog>
    </div>);
  }
}
