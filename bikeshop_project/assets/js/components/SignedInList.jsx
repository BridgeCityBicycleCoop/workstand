import React from 'react';
import {List, ListItem} from 'material-ui/List';

export default class SignedInList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {tick: 0};
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentDidMount () {
        this.timer = setInterval(this.tick, 50);
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    tick () {
        this.setState({tick: this.state.tick++});
    }

    render () {
        let members = this.props.members.map((member) => {
            return <ListItem key={member.id} primaryText={member.text} secondaryText={`${member.purpose} – ${member.at.fromNow()}`} />
        });
        
        return (
            <div className="mdl-cell mdl-cell--12-col">
                <h3>Members signed in</h3>
                {!!members.length ? members : 'No members currently signed in.'}
            </div>
        );
    }
}