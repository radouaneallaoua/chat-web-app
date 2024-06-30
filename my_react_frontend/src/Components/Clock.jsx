import React from "react";

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hour: new Date() };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.setState({ hour: new Date() });
    }

    componentDidMount() {
        this.timer = setInterval(this.handleChange, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <div>
                {this.state.hour.toLocaleTimeString()}
            </div>
        );
    }
}

export default Clock;
