import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import moment from 'moment';

export default class SignedInList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tick: 0 };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 50);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({ tick: this.state.tick += 1 });
  }

  render() {
    const members = this.props.members.sort((l, r) => l.at.diff(r.at))
            .reverse()
            .map(member => <ListItem key={member.id} primaryText={member.text} secondaryText={`${member.purpose} – ${member.at.fromNow()}`} />);

    return (
      <div className="mdl-cell mdl-cell--12-col">
        <h3>Members signed in</h3>
        {members.length ? members : 'No members currently signed in.'}
      </div>
    );
  }
}
