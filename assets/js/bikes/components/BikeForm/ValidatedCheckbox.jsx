import Checkbox from 'material-ui/Checkbox';
import React from 'react';

const styles = {
  error: {
    color: 'red',
    fontSize: 'small',
  },
};

export default class ValidatedCheckbox extends Checkbox {
  render() {
    const { meta: { /* touched, */ error } } = this.props;
    return (
      <div>
        {super.render()}
        {error && <span style={styles.error}>{error}</span>}
      </div>
    );
  }
}
