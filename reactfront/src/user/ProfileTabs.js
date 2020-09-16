import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { findPeople, follow } from './apiUser';
import { isAuthenticated } from '../auth/auth';
import Img from 'react-image';
import LoaderSvg from '../images/rings.svg';

class ProfileTabs extends Component {
	constructor() {
		super();
		this.state = {
			active: 1,
			users: [],
			error: '',
			open: false
		};
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		findPeople(userId, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ users: data });
			}
		});
	}

	switchToFollower = (i) => {
		this.setState({ active: 1 });
	};
	switchToFollowing = (i) => {
		this.setState({ active: 2 });
	};
	switchToWhotofollow = (i) => {
		this.setState({ active: 3 });
	};

	clickFollow = (person, i) => {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		follow(userId, token, person._id).then((data) => {
			if (data.error) {
				this.setState({ error: data.error });
			} else {
				let toFollow = this.state.users;
				toFollow.splice(i, 1);
				this.setState({
					users: toFollow,
					open: true
				});
			}
		});
	};

	render() {
		const { following, followers, user } = this.props;
		const { active, users } = this.state;
		return (
			<div>
				<div className="flex lg:m-4 mx-0 my-4 bg-gray-700 rounded">
					<div className={active === 1 ? 'flex-1 bg-gray-800 rounded-l' : 'flex-1'}>
						<button
							className="w-full text-white font-semibold py-2 tracking-wide uppercase text-xs"
							onClick={this.switchToFollower}
						>
							Followers
						</button>
					</div>
					<div className={active === 2 ? 'flex-1 bg-gray-800' : 'flex-1'}>
						<button
							className="w-full text-white font-semibold py-2 tracking-wide uppercase text-xs"
							onClick={this.switchToFollowing}
						>
							Following
						</button>
					</div>
					{isAuthenticated().user._id === user && (
						<div className={active === 3 ? 'flex-1 bg-gray-800 rounded-r' : 'flex-1'}>
							<button
								className="w-full text-white font-semibold py-2 tracking-wide uppercase text-xs"
								onClick={this.switchToWhotofollow}
							>
								To Follow
							</button>
						</div>
					)}
				</div>
				<div className="flex flex-wrap">
					{this.state.active === 1 && (
						<div className="w-full flex flex-wrap">
							{followers.map((person, i) => (
								<div className="w-full md:w-1/2 lg:w-full md:px-1 lg:px-4 mb-4" key={i}>
									<div className="rounded shadow bg-gray-800 py-3 px-5 text-center flex">
										<div className="w-32">
											<Img
												className="h-20 w-20 rounded-full object-cover border-4 border-gray-800"
												src={`https://i.imgur.com/${person.avatar}m.png`}
												alt="People"
												loader={<img src={LoaderSvg} className="mx-auto h-20" />}
											/>
										</div>
										<div className="block w-full px-2">
											<Link to={`/user/${person._id}`}>
												<h1 className="block font-semibold text-cream my-2 text-left">
													{person.name}
												</h1>
											</Link>
											<Link
												to={`/user/${person._id}`}
												className="block bg-gray-900 rounded text-white block w-full py-1 uppercase text-sm tracking-widest"
											>
												VISIT
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
					{this.state.active === 2 && (
						<div className="w-full flex flex-wrap">
							{following.map((person, i) => (
								<div className="w-full md:w-1/2 lg:w-full md:px-1 lg:px-4 mb-4" key={i}>
								<div className="rounded shadow bg-gray-800 py-3 px-5 text-center flex">
									<div className="w-32">
										<Img
											className="h-20 w-20 rounded-full object-cover border-4 border-gray-800"
											src={`https://i.imgur.com/${person.avatar}m.png`}
											alt="People"
											loader={<img src={LoaderSvg} className="mx-auto h-20" />}
										/>
									</div>
									<div className="block w-full px-2">
										<Link to={`/user/${person._id}`}>
											<h1 className="block font-semibold text-cream my-2 text-left">
												{person.name}
											</h1>
										</Link>
										<Link
											to={`/user/${person._id}`}
											className="block bg-gray-900 rounded text-white block w-full py-1 uppercase text-sm tracking-widest"
										>
											VISIT
										</Link>
									</div>
								</div>
							</div>
							))}
						</div>
					)}
					{this.state.active === 3 &&
					isAuthenticated().user._id === user && (
						<div className="w-full flex flex-wrap">
							{users.map((person, i) => (
								<div className="w-full md:w-1/2 lg:w-full md:px-1 lg:px-4 mb-4" key={i}>
									<div className="rounded shadow bg-gray-800 py-3 px-5 text-center flex">
										<div className="w-32">
											<Img
												className="h-20 w-20 rounded-full object-cover border-4 border-gray-800"
												src={`https://i.imgur.com/${person.avatar}m.png`}
												alt="People"
												loader={<img src={LoaderSvg} className="mx-auto h-20" />}
											/>
										</div>
										<div className="block w-full px-2">
											<Link to={`/user/${person._id}`}>
												<h1 className="block font-semibold text-cream my-2 text-left">
													{person.name}
												</h1>
											</Link>
											<button
												onClick={() => this.clickFollow(person, i)}
												className="block bg-gray-900 rounded text-white block w-full py-1 uppercase text-sm tracking-widest"
											>
												FOLLOW
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default ProfileTabs;
