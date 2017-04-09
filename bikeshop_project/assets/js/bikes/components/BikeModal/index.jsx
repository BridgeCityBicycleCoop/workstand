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
  }

  render() {
    return (
      <Dialog
        title='Bike'
        open={this.props.open}
        modal={false}
        autoScrollBodyContent
      >
          <BikeForm
            handleModalClose={this.props.handleClose}
            enableReinitialize
          />
      }
      </Dialog>
    )
  }
}

BikeModal.propTypes = {
  open: PropTypes.bool,
};

export default BikeModal;
