import React from 'react';
import fetch from 'isomorphic-fetch';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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

export default class MemberTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      searchText: '',
      filteredMembers: [],
      error: undefined,
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    fetch('/api/v1/members/', { credentials: 'same-origin' })
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        console.log('RESPONSE FRONT END');
        console.log(data);
        let is_active_filter_data = data.filter(function(item){
          return item.is_active;
        });
        console.log('FILTERED ARRAY');
        console.log(is_active_filter_data);
        this.setState({ members: is_active_filter_data });
        console.log('request succeeded with JSON response', data);
      })
      .catch((error) => {
        console.log('request failed', error);
      });
  }

  handleUpdate(event, value) {
    this.setState({ ...this.state, searchText: value });
  }

  clearSearch() {
    this.setState({
      ...this.state,
      searchText: '',
    });
  }

  handleSearch() {
    const value = this.state.searchText.trim();
    const self = this;

    fetch(`/members/search/${value}/`, { credentials: 'same-origin' })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }

        throw new Error('Bad response from server');
      })
      .then((data) => {
        if (data.results.length > 0) {
          self.setState({
            ...this.state,
            error: '',
            filteredMembers: this.state.members.filter((member) => {
              const ids = data.results.map(m => m.id);
              return ids.indexOf(member.id) !== -1;
            }),
          });
        } else {
          self.setState({ ...this.state, filteredMembers: [], error: 'Member not found.' });
        }
      });
  }

  render() {
    const memberRows = this.state.members.map(member => (
      <TableRow selectable={false} key={member.id}>
        <TableRowColumn>{member.first_name}</TableRowColumn>
        <TableRowColumn>{member.last_name}</TableRowColumn>
        <TableRowColumn>{member.email}</TableRowColumn>
        <TableRowColumn><FlatButton label="Edit" href={`/members/edit/${member.id}`} primary /></TableRowColumn>
      </TableRow>
      ));

    const filteredMemberRows = this.state.filteredMembers.map(member => (
      <TableRow selectable={false} key={member.id}>
        <TableRowColumn>{member.first_name}</TableRowColumn>
        <TableRowColumn>{member.last_name}</TableRowColumn>
        <TableRowColumn>{member.email}</TableRowColumn>
        <TableRowColumn><FlatButton label="Edit" href={`/members/edit/${member.id}`} primary /></TableRowColumn>
      </TableRow>
      ));


    return (
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--12-col">
          <h3>Members</h3>
          <Toolbar>
            <ToolbarGroup>
              <TextField
                hintText="ma@example.com OR name"
                floatingLabelText="Search for member"
                onChange={this.handleUpdate}
                value={this.state.searchText}
              />
              <RaisedButton label="Search" primary onClick={this.handleSearch} />
              <RaisedButton label="Clear" onClick={this.clearSearch} secondary />
            </ToolbarGroup>
          </Toolbar>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>First name</TableHeaderColumn>
                <TableHeaderColumn>Last Name</TableHeaderColumn>
                <TableHeaderColumn>Email</TableHeaderColumn>
                <TableHeaderColumn />
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {filteredMemberRows.length ?
                filteredMemberRows : undefined
              }
              {memberRows.length && !this.state.searchText ?
              memberRows :
              <TableRow>
                <TableRowColumn>{this.state.error || 'Members loading.'}</TableRowColumn>
              </TableRow>
            }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}
