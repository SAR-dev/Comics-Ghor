import React, { Component } from 'react';
import ads from './advertisement/advertisement.json';
import AdTemplate from './advertisement/AdTemplate';

export default class AdLayout extends Component {
    constructor(){
        super()
        this.state = {
            data: []
        }
    }

    componentDidMount(){
        this.setState({data: ads})
    }

	render() {
        const {data} = this.state

		return (
			<div className="max-w-screen-lg flex flex-wrap items-start p-2 mx-auto my-10">
				<div className="w-full lg:w-3/4 px-2">{this.props.children}</div>
				<div className="w-full mt-20 lg:mt-0 lg:w-1/4 lg:sticky lg:top-0">
                    <div className="flex flex-wrap mx-auto max-w-screen-sm">
                    {data.map((item, i) => {
                        return <AdTemplate item={item} key={i} />
                    })}
                    </div>
				</div>
			</div>
		);
	}
}
