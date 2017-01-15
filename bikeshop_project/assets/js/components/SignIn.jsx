import fetch from 'isomorphic-fetch';
import moment from 'moment';
import { polyFill } from 'es6-promise';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

import Member from './Member';
import Purpose from './Purpose';
import SignedInList from './SignedInList';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      signOn: { purpose: 'FIX', member: undefined },
      error: '',
      signedIn: [],
      searchText: '',
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.signIn = this.signIn.bind(this);
    this.chooseMember = this.chooseMember.bind(this);
    this.handlePurposeChoice = this.handlePurposeChoice.bind(this);
  }

  componentDidMount() {
    fetch('/members/signin/')
            .then(response => response.json())
            .then((data) => {
              const visits = JSON.parse(data);
              this.setState({ signedIn: visits.map(visit => ({
                id: visit.member.id,
                purpose: visit.purpose,
                text: `${visit.member.first_name} ${visit.member.last_name}`,
                value: `${visit.member.first_name} ${visit.member.last_name} <${visit.member.email}>`,
                at: moment(visit.created_at),
              })) });
            });
  }

  onUpdateSearchText(searchText) {
    this.setState({ searchText });
  }

  chooseMember(chosenRequest, index) {
    const member = this.state.members[index];
    const purpose = this.state.signOn.purpose;

    this.setState({ ...this.state, signOn: { member, purpose } });
  }

  signIn() {
    const purpose = this.state.signOn.purpose;
    const member = this.state.signOn.member;

    if (!this.state.signedIn.find(signedInMember => signedInMember.id === member.id)) {
      fetch('/members/signin/', {
        method: 'post',
        body: `id=${member.id}&purpose=${purpose}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        } })
          .then((response) => {
            if (response.status === 201) {
              return response.json();
            }
          })
          .then((data) => {
            const signedIn = this.state.signedIn;
            const parsedData = JSON.parse(data);

            signedIn.push({ ...member, purpose, at: moment(parsedData.results.created_at) });
            this.setState({
              ...this.state,
              signedIn,
              signOn: { purpose: 'FIX', member: undefined },
              searchText: '',
              members: [],
            });
          });
    } else {
      this.setState({ ...this.state, error: 'Member already signed in.' });
    }
  }

  handlePurposeChoice(event, index, value) {
    this.setState({ ...this.state, signOn: { ...this.state.signOn, purpose: value } });
  }

  handleUpdate(text) {
    const self = this;
    self.setState({ searchText: text });
    fetch(`/members/search/${text}/`)
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
                  members: data.results.map(result => ({ text: `${result.name}`, value: `${result.name} <${result.email}>`, id: result.id })),
                });
              } else {
                self.setState({ ...this.state, error: 'Member not found.' });
              }
            });
  }

  render() {
    return (
      <div>
        <div className="mdl-grid">
          <div className="mdl-cell--12-col mdl-cell">
            <h1 className="mdl-typography--display-4">Sign-in</h1>
            <h2 className="mdl-typography--display-3">{moment().format('MMM DD, YYYY')}</h2>
          </div>
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell--8-col mdl-cell">
            <Member
              handleUpdate={this.handleUpdate}
              signIn={this.chooseMember}
              error={this.state.error}
              members={this.state.members}
              searchText={this.state.searchText}
            />
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            <Purpose
              handleChange={this.handlePurposeChoice}
              initialValue={this.state.signOn.purpose}
            />
          </div>
        </div>

        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--2-col mdl-cell--10-offset">
            <RaisedButton onClick={this.signIn} label="Sign-in" />
          </div>
        </div>
        <div className="mdl-grid">
          <SignedInList members={this.state.signedIn} />
        </div>
      </div>
    );
  }
}
