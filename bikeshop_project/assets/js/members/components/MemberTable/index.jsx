import React from 'react';
import { polyFill } from 'es6-promise';
import fetch from 'isomorphic-fetch';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
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
  }

  componentDidMount() {
    fetch('/api/v1/members/')
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        this.setState({ members: data });
        console.log('request succeeded with JSON response', data);
      })
      .catch((error) => {
        console.log('request failed', error);
      });
  }

  handleUpdate(event, value) {
    const self = this;
    self.setState({ searchText: value });
  }

  handleSearch() {
    const value = this.state.searchText.trim();
    const self = this;

    fetch(`/members/search/${value}/`)
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
            filteredMembers: data.results,
          });
        } else {
          self.setState({ ...this.state, error: 'Member not found.' });
        }
      });

  }

  render() {
    const memberRows = this.state.members.map(member => (
      <TableRow selectable={false} key={member.id}>
        <TableRowColumn>{member.first_name}</TableRowColumn>
        <TableRowColumn>{member.last_name}</TableRowColumn>
        <TableRowColumn>{member.email}</TableRowColumn>
        <TableRowColumn><FlatButton label="Edit" href={`/members/edit/${member.id}`} /></TableRowColumn>
      </TableRow>
      ));

    const filteredMemberRows = this.state.members.map(member => (
      <TableRow selectable={false} key={member.id}>
        <TableRowColumn>{member.first_name}</TableRowColumn>
        <TableRowColumn>{member.last_name}</TableRowColumn>
        <TableRowColumn>{member.email}</TableRowColumn>
        <TableRowColumn><FlatButton label="Edit" href={`/members/edit/${member.id}`} /></TableRowColumn>
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
                searchText={this.state.searchText}
              />
              <RaisedButton label="Serach" primary onClick={this.handleSearch} />
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
              {memberRows.length && filteredMemberRows.length === 0 ?
              memberRows :
              <TableRow>
                <TableRowColumn>{'Members loading.'}</TableRowColumn>
              </TableRow>
            }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}
