import React, { Component } from 'react';
import Img from 'react-image';
import LoaderSvg from '../../images/rings.svg';

export default class AdTemplate extends Component {
	render() {
		const { title, image, link } = this.props.item;
		return (
			<div className="w-1/2 sm:w-1/3 lg:w-full">
				<div className="m-2 rounded border-dashed border border-gray-500 hover:opacity-75 p-2 mx-auto" style={{maxWidth: 200}}>
					<a href={link} target="_blank" rel="noopener noreferrer">
						<Img
							src={image}
							className="w-full rounded mb-1"
							loader={<img src={LoaderSvg} className="h-20 mx-auto" />}
						/>
						<h1 className="text-xs text-gray-400">{title}</h1>
					</a>
				</div>
			</div>
		);
	}
}
