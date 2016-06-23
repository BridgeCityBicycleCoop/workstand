import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { polyFill } from 'es6-promise';
import fetch from 'isomorphic-fetch';
import Purpose from './Purpose';
import Member from './Member';
import SignedInList from './SignedInList';
import moment from 'moment';

export default class SignIn extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            members: [],
            signOn: {purpose: 'FIX', member: undefined},
            error: '',
            signedIn: [],
            searchText: ''
        };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.signIn = this.signIn.bind(this);
        this.chooseMember = this.chooseMember.bind(this);
        this.handlePurposeChoice = this.handlePurposeChoice.bind(this);
  }

    handlePurposeChoice (event, index, value) {
        this.setState({...this.state, signOn: {...this.state.signOn, purpose: value}});
    }

    handleUpdate (text, dataSource) {
        const self = this;
        self.setState({searchText: text})
        fetch(`//bikeshop.local/member/search/${text}/`)
            .then((response) => {
                if (response.status === 200)
                    return response.json();
            })
            .then((data) => {
                if (data.results.length > 0) {
                    self.setState({
                        ...this.state,
                        error: '',
                        members: data.results.map((result) => {
                            return {text: `${result.name}`, value: `${result.name} <${result.email}>`, id: result.id}
                        })
                    });
                } else {
                    self.setState({...this.state, error: 'Member not found.'})
                }
            })
    }

    signIn () {
        const purpose = this.state.signOn.purpose;
        const member = this.state.signOn.member;

        if (!this.state.signedIn.find((signedInMember) => {return signedInMember.id === member.id})) {
            fetch('//bikeshop.local/member/signin/', {
                method: 'post',
                body: `id=${member.id}&purpose=${purpose}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                if (response.status === 201)
                    return response.json();
            }).then((data) => {
                const now = moment();
                const signedIn = this.state.signedIn;
                signedIn.push({...member, purpose, at: now});
                this.setState({
                    ...this.state,
                    signedIn: signedIn,
                    signOn: {purpose: 'FIX', member: undefined},
                    searchText: '',
                    members: []
                })
            });
        } else {
            this.setState({...this.state, error: 'Member already signed in.'})
        }
    }

    chooseMember (chosenRequest, index) {
        console.log(index);
        const member = this.state.members[index];
        const purpose = this.state.signOn.purpose;

        this.setState({...this.state, signOn: {member, purpose}});
    }

    onUpdateSearchText(searchText, dataSource) {
        this.setState({searchText: searchText})
    }

    render () {
        return (
            <div>
                <Member
                    handleUpdate={this.handleUpdate}
                    signIn={this.chooseMember}
                    error={this.state.error}
                    members={this.state.members}
                    searchText={this.state.searchText}
                />
                <br />
                <Purpose handleChange={this.handlePurposeChoice} default={this.state.signOn.purpose}  />
                <div>
                    <RaisedButton onClick={this.signIn} label="Sign-in" />
                </div>
                <br />
                <SignedInList members={this.state.signedIn} />
            </div>
        );
    }
}