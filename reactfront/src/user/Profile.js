import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { postsByUser } from './apiUser';
import PrimaryLayout from '../core/PrimaryLayout';
import Img from 'react-image';
import Moment from 'react-moment';
import LoadingModal from '../core/LoadingModal';
import LoaderSvg from '../images/rings.svg';
import DeleteUser from './DeleteUser';
import ReactTooltip from 'react-tooltip';
import SeoHelmet from '../core/SeoHelmet';

class Profile extends Component {
	constructor() {
		super();
		this.state = {
			user: { following: [], followers: [] },
			redirectToSignin: false,
			following: false,
			error: '',
			posts: [],
			initializing: true
		};
	}

	checkFollow = (user) => {
		const jwtC = isAuthenticated();
		const match = user.followers.find((follower) => {
			return follower._id === jwtC.user._id;
		});
		return match;
	};

	clickFollow = (callApi) => {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		callApi(userId, token, this.state.user._id).then((data) => {
			if (data.error) {
				this.setState({ error: data.error });
			} else {
				this.setState({ user: data, following: !this.state.following });
			}
		});
	};

	init = (userId) => {
		const token = isAuthenticated().token;
		read(userId, token).then((data) => {
			if (data.error) {
				this.setState({ redirectToSignin: true });
			} else {
				let following = this.checkFollow(data);
				this.setState({ user: data, following });
				this.loadPosts(data._id);
				this.setState({ initializing: false });
			}
		});
	};

	loadPosts = (userId) => {
		const token = isAuthenticated().token;
		postsByUser(userId, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ posts: data });
			}
		});
	};

	componentDidMount() {
		const userId = this.props.match.params.userId;
		this.init(userId);
	}

	componentWillReceiveProps(props) {
		const userId = props.match.params.userId;
		this.init(userId);
	}

	getFirstImage = (images) => {
		if (images) {
			const imageFirst = images.split(',');
			return imageFirst[0];
		} else {
			return false;
		}
	};

	render() {
		const { redirectToSignin, user, posts, initializing } = this.state;
		if (redirectToSignin) {
			return <Redirect to="/signin" />;
		}

		return (
			<>
			<SeoHelmet title={user.name} desc={user.about ? user.about : user.name} image={`https://i.imgur.com/${user.avatar}m.png`} />
			<PrimaryLayout>
				<div className="flex flex-wrap">
					<div className="w-full lg:w-2/3">
						<div className="w-full relative h-48 sm:h-64 lg-300">
						{isAuthenticated().user &&
						isAuthenticated().user.role === "admin" && (
							<div className="absolute top-0 right-0 m-2">
									<Link
										className="mx-2 px-4 py-2 text-sm shadow bg-gray-600 text-white rounded"
										to={`/user/edit/${user._id}`}
									>
										Edit User
									</Link>
									<DeleteUser userId={user._id} />
							</div>
						)}
							<Img
								src={`https://i.imgur.com/${user.cover}h.png`}
								alt="Cover"
								className="w-full object-cover h-48 sm:h-64 lg-300 shadow"
								loader={ <img src={LoaderSvg} className="mx-auto h-48 md:h-64 lg-300" />
								}
							/>
							<Img
								src={`https://i.imgur.com/${user.avatar}m.png`}
								alt="Avatar"
								className="absolute -mb-10 ml-5 lg:-mb-16 sm:-mb-10 border-4 border-gray-800 shadow-lg bottom-0 rounded-full h-24 w-24 lg:h-32 lg:w-32 object-cover"
								loader={ <img src={LoaderSvg} className="h-24 lg:h-32 absolute ml-5 mb-5 -mb-16 bottom-0" />
								}
							/>
							{isAuthenticated().user &&
							isAuthenticated().user._id === user._id && (
								<button
									onClick={() => this.props.history.push(`/user/edit/${user._id}`)}
									className="bg-gray-800 text-cream rounded md:rounded-full border-1 md:border-2 border-gray-700 px-2 md:px-4 py-1 absolute bottom-0 right-0 -mb-12 mr-4 text-xs md:text-sm"
								>
									Edit Profile
								</button>
							)}
							{isAuthenticated().user && isAuthenticated().user._id === user._id ? (
								''
							) : (
								<FollowProfileButton
									following={this.state.following}
									onButtonClick={this.clickFollow}
								/>
							)}
						</div>
						<div
							className="w-full pt-20 pb-5 px-5 shadow border border-t-0 bg-gray-900 border-gray-800"
						>
							<div className="text-2xl font-bold text-white pb-2">
								{user.name}
								<div data-tip={`${user.name}'s Coins`} data-for="points" className="text-2xl cursor-pointer inline-block ml-3 text-yellow-500 hover:text-yellow-600 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-140">
									<span><i className="fas fa-compact-disc spin"></i> {user.points ? user.points.reduce((a, b) => a + b, 0) : 0}</span>
								</div>
								<ReactTooltip place="right" id="points" type="warning" effect="solid"/>
								{user.fullname && (
									<div className="text-cream text-sm font-semibold">
										{user.fullname}
									</div>
								)}
							</div>
							<div className="flex flex-wrap">
								<div className="w-2/3">
									<div className="text-xs md:text-sm text-cream">
										<i className="far fa-envelope mr-2" />
										{user.email}
									</div>
									<div className="text-xs md:text-sm text-cream">
										<i className="fas fa-map-marker mr-2" />
										{`Joined ${new Date(user.created).getFullYear()}`}
									</div>
								</div>
								<div className="w-1/3 text-right">
									<div className="pl-1 md:pl-2 text-xs md:text-sm text-cream">
										<i className="fas fa-sort-amount-up mr-2" />
										<h6 className="inline-block w-20">{user.followers.length} Followers</h6>
									</div>
									<div className="pl-1 md:pl-2 text-xs md:text-sm text-cream">
										<i className="fas fa-sort-amount-down-alt mr-2" />
										<h6 className="inline-block w-20">{user.following.length} Following</h6>
									</div>
								</div>
								<div className="w-full my-5 flex flex-wrap">
									{user.Sinstagram && (
										<a
											className="mb-2 mr-2 text-sm rounded bg-pink-700 px-2 py-1 text-white"
											href={`${user.Sinstagram}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<i className="fab fa-instagram mr-2" />
											Instagram
										</a>
									)}
									{user.Sfacebook && (
										<a
											className="mb-2 mr-2 text-sm rounded bg-blue-700 px-2 py-1 text-white"
											href={`${user.Sfacebook}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<i className="fab fa-facebook mr-2" />
											Facebook
										</a>
									)}
									{user.Stwitter && (
										<a
											className="mb-2 mr-2 text-sm rounded bg-blue-500 px-2 py-1 text-white"
											href={`${user.Stwitter}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<i className="fab fa-twitter mr-2" />
											Twitter
										</a>
									)}
									{user.Syoutube && (
										<a
											className="mb-2 mr-2 text-sm rounded bg-red-600 px-2 py-1 text-white"
											href={`${user.Syoutube}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<i className="fab fa-youtube mr-2" />
											Youtube
										</a>
									)}
									{user.blood && (
										<span
											className="mb-2 mr-2 text-sm rounded bg-pink-600 px-2 py-1 text-white"
										>
											<i className="fas fa-tint mr-2" />
											{user.blood}
										</span>
									)}
									{user.gender === 'Male' && (
										<span
											className="mb-2 mr-2 text-sm rounded bg-teal-700 px-2 py-1 text-white"
										>
											<i className="fab fa-phoenix-squadron mr-2" />
											{user.gender}
										</span>
									)}
									{user.gender === 'Female' && (
										<span
											className="mb-2 mr-2 text-sm rounded bg-teal-700 px-2 py-1 text-white"
										>
											<i className="fab fa-phoenix-framework mr-2" />
											{user.gender}
										</span>
									)}
									{user.gender === 'Other' && (
										<span
											className="mb-2 mr-2 text-sm rounded bg-gray-600 px-2 py-1 text-white"
										>
											<i className="fab fa-phoenix-framework mr-2" />
											{user.gender}
										</span>
									)}
								</div>
								{user.about && (
								<div className="whitespace-pre-wrap w-full text-cream text-sm mb-5">
									<h2 className="text-xl font-semibold mb-2 pb-2 text-white border-b-2 border-gray-400">
										About
									</h2>
									{user.about}
								</div>	
								)}
								<div className="mb-5 w-full text-sm text-cream">
									<h2 className="text-xl font-semibold mb-2 pb-2 text-white border-b border-gray-400 shadow-sm">
										Contact Info
									</h2>
									{user.email && <div className="py-1"><i className="far fa-envelope w-8 font-semibold"></i>{user.email}</div>}
									{user.contact && <div className="py-1"><i className="fas fa-phone-square-alt w-8 font-semibold"></i>{user.contact}</div>}
									{user.address && <div className="py-1"><i className="fas fa-location-arrow w-8 font-semibold"></i>{user.address}</div>}
								</div>
								<div className="w-full text-gray-600 text-sm">
									<h2 className="text-xl font-semibold mb-2 pb-2 text-white border-b border-gray-400 shadow-sm">
										Posts
									</h2>
									<div className="flex flex-wrap">
									{posts.map((post, i) => (
										<div key={i} className="md:w-1/2 md:px-2 w-full my-3 relative">
											<Link to={`/post/${post._id}`}>
												<Img
													src={`https://i.imgur.com/${post.postedBy.avatar}s.png`}
													className=" mb-3 rounded-full h-10 w-10 border-4 border-gray-700"
												/>
												<div className="absolute top-0 left-0 ml-12 pl-2 mt-2 text-cream font-semibold text-xs">
													<Moment fromNow>{new Date(post.created)}</Moment>
												</div>
												<div className="pl-4 ml-4 pb-2 border-l border-gray-400">
													{post.thumbnail !== 'undefined' && (
														<div className="w-full h-64 overflow-hidden">
															<Img
																src={`https://i.imgur.com/${post.thumbnail}m.png`}
																alt="Cover"
																className="h-64 w-full object-cover rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-125"
																loader={ <img src={LoaderSvg} className="mx-auto h-64 w-full" />}
															/>
														</div>
													)}
													<div>
														<h1 className={post.thumbnail === 'undefined' ? "text-xl text-cream font-semibold mt-2" : "text-base text-cream font-semibold mt-2"}>
															{post.title}
														</h1>
													</div>
												</div>
											</Link>
										</div>
									))}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full lg:w-1/3">
						<ProfileTabs followers={user.followers} following={user.following} user={user._id} />
					</div>
				</div>
				<LoadingModal trigger={initializing} text="INITIALIZING..." />
			</PrimaryLayout>
			</>
		);
	}
}
export default Profile;
