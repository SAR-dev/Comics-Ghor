import React, { Component } from 'react';

export default class PrimaryLayout extends Component {
    render() {
        return (
            <div className="container px-2 mx-auto mb-16">
                {this.props.children}
            </div>
        )
    }
}
