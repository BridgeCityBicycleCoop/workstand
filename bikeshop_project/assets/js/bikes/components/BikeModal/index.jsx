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
    if (this.props.bike) {
      const title = (
        <div>
          <h3>{this.props.bike ? 'Edit Bike' : 'Add Bike'}</h3>
        </div>
    );

      return (<div>
        <Dialog
          title={title}
          open={this.props.open}
          autoScrollBodyContent
        >
          { this.props.bike ?
            <BikeForm
              enableReinitialize
              bike={this.props.bike}
              bikes={this.props.bikes}
            /> :
            <div>Unable to edit bike.</div>
        }
        </Dialog>
      </div>);
    }

    return null;
  }
}

BikeModal.propTypes = {
  open: PropTypes.bool,
  bike: PropTypes.object,
};

export default BikeModal;
