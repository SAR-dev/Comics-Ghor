import React, { Component } from 'react';
import Category from '../category/Category';
import SideBar from './SideBar';

export default class SecondaryLayout extends Component {
	render() {
		return (
			<div style={{maxWidth: 1150}} className="flex flex-wrap p-2 mx-auto mb-16 items-start">
				<div className="hidden lg:block lg:w-1/4 sticky top-0">
					<SideBar />
				</div>
				<div className="w-full lg:w-2/4 lg:px-6">{this.props.children}</div>
				<div className="hidden lg:block lg:w-1/4 sticky top-0">
					<Category />
				</div>
			</div>
		);
	}
}
