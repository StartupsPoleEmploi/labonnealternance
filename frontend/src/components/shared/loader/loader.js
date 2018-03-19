import React, { Component } from 'react';


export class Loader extends Component {

    render() {
        return <div className={this.props.cssClass}>&nbsp;</div>;
    }
}