import AutoComplete from 'material-ui/AutoComplete';
import React from 'react';

export default class Member extends React.Component {
  render() {
    return (
      <AutoComplete
        dataSource={this.props.members}
        onUpdateInput={this.props.handleUpdate.bind(this)}
        openOnFocus
        filter={AutoComplete.noFilter}
        onNewRequest={this.props.signIn.bind(this)}
        errorText={this.props.error}
        hintText="Search members"
        searchText={this.props.searchText}
        fullWidth
        textFieldStyle={{ textAlign: 'center', fontSize: '32px', lineHeight: '48px' }}
        tabIndex={this.props.tabIndex}
      />
    );
  }
}
