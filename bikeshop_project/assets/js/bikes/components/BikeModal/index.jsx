import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import BikeForm from '../BikeForm';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class BikeModal extends React.Component {
  static propTypes = {
    open: PropTypes.boolean,
  }

  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      bike: undefined,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ open: newProps.open || false, bike: newProps.bike || false });
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

    return (<div>
      <Dialog
        title="Edit Bike"
        actions={actions}
        modal
        open={this.state.open}
        autoScrollBodyContent
      >
        { this.state.bike ? <BikeForm bike={this.state.bike} /> : <div>Unable to edit bike.</div>}
      </Dialog>
    </div>);
  }
}
