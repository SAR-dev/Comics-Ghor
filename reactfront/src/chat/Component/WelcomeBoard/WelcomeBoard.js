import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default class WelcomeBoard extends Component {
	render() {
		return (
			<div className="flex flex-1 flex-col items-center justify-center my-5">
				<span className="text-3xl text-white tracking-wide font-semibold">{`Welcome, ${this.props.currentUserNickname}`}</span>
				<img className="rounded-full shadow-lg h-32 w-32 object-cover my-4" src={this.props.currentUserAvatar} alt="icon avatar" />
				<span className="text-lg text-cream">Let's start talking. Great things might happen.</span>
				<Link to="/chat/profile" className="text-sm text-white mt-5 px-4 py-1 rounded bg-gray-700">Update Profile</Link>
			</div>
		);
	}
}
