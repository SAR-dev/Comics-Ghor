import React, { Component } from 'react';
import { singlePost, remove, like, unlike } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';
import Comment from './Comment';
import AdLayout from '../core/AdLayout';
import Img from 'react-image';
import '../post-markdown.css';
import Moment from 'react-moment';
import Clap from '../images/clap/clap.svg';
import Clapping from '../images/clap/clapping.gif';
import Modal from 'react-modal';
import LoadingModal from '../core/LoadingModal';
import LoaderSvg from '../images/rings.svg';
import SeoHelmet from '../core/SeoHelmet';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

class SinglePost extends Component {
	constructor() {
		super();
		this.state = {
			_id: '',
			title: '',
			body: '',
			created: '',
			image: [],
			postedBy: {},
			seriesName: '',
			seriesId: '',
			redirectToHome: false,
			redirectToSignin: false,
			check: false,
			likes: '',
			like: false,
			comments: [],
			initializing: true,
			summary: '',
			thumbnail: '',
			liking: false,
			typeOf: ''
		};
	}

	checkLike = (likes) => {
		const userId = isAuthenticated() && isAuthenticated().user._id;
		let match = likes.indexOf(userId) !== -1;
		return match;
	};

	likeToogle = () => {
		this.setState({liking: true})
		if (!isAuthenticated()) {
			this.setState({ redirectToSignin: true });
			return false;
		}
		let callApi = this.state.like ? unlike : like;
		const userId = isAuthenticated().user._id;
		const postId = this.state._id;
		const ownerId = this.state.postedBy._id;
		const token = isAuthenticated().token;
		callApi(userId, token, postId, ownerId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({
					like: !this.state.like,
					likes: data.likes,
					liking: false
				});
			}
		});
	};

	componentDidMount() {
		this.initialize()
	}

	componentDidUpdate (prevProps) {
		if (prevProps.location.key !== this.props.location.key) {
			this.setState({initializing: true})
			this.initialize()
		}
	}

	initialize = () => {
		window.scrollTo(0, 0);
		const postId = this.props.match.params.postId;
		singlePost(postId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				const image = data.image[0] ? data.image[0].split(',') : undefined;
				this.setState({
					_id: data._id,
					title: data.title,
					body: data.body,
					created: data.created,
					image: image,
					postedBy: data.postedBy,
					seriesName: data.seriesOf.name,
					seriesId: data.seriesOf._id,
					likes: data.likes,
					like: this.checkLike(data.likes),
					comments: data.comments,
					initializing: false,
					summary: data.summary,
					thumbnail: data.thumbnail,
					typeOf: data.typeOf
				});
			}
		});
	}

	checkDeletePost = () => {
		this.setState({ check: true });
	};

	cancelDeletePost = () => {
		this.setState({ check: false });
	};

	deletePost = () => {
		const postId = this.props.match.params.postId;
		const token = isAuthenticated().token;
		remove(postId, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ redirectToHome: true });
			}
		});
	};

	createMarkup = () => {
		return { __html: this.state.body };
	};

	updateComments = (comments) => {
		this.setState({ comments });
	};

	render() {
		const {
			title,
			created,
			image,
			postedBy,
			seriesName,
			seriesId,
			initializing,
			check,
			_id,
			likes,
			like,
			comments,
			summary,
			thumbnail,
			liking,
			typeOf
		} = this.state;
		if (this.state.redirectToHome) {
			return <Redirect to={'/'} />;
		} else if (this.state.redirectToSignin) {
			return <Redirect to={'/signin'} />;
		}
		return (
			<>
			<SeoHelmet title={title} desc={summary} image={`https://i.imgur.com/${thumbnail}m.png`} />
			<AdLayout>
				<div className="mx-auto max-w-screen-sm">
				<div className="flex flex-wrap">
					<h1 className="lg:text-3xl text-2xl text-white font-semibold">{title}</h1>
					<div className="my-4 w-full flex flex-wrap pl-4 border-l-4 border-gray-700">
						{seriesId !== process.env.REACT_APP_NONE_SERIES && (
						<div className="w-full my-1 text-gray-300 text-sm hover:text-gray-500">
							<Link to={`/series/${seriesId}`}>
								<h6 className="inline">
									<i className="fas fa-layer-group pr-2 mr-2 border-r border-gray-500" />
									{seriesName}
								</h6>
							</Link>
						</div>
						)}
						<div className="w-full my-1 text-gray-300 text-sm hover:text-gray-500">
						<Link to={`/user/${postedBy._id}`}>
							<h6 className="inline">
								<i className="fas fa-user-secret pr-2 mr-2 border-r border-gray-500" />
								{postedBy.name}
							</h6>
						</Link>
						</div>
						<div className="w-full my-1 text-gray-300 text-sm">
							<h6 className="inline">
								<i className="fas fa-hourglass-start pr-2 mr-2 border-r border-gray-500" />
								{<Moment fromNow>{new Date(created)}</Moment>}
							</h6>
						</div>
					</div>
					{this.state.body !== "<p></p>" && (
						<div className="w-full">
							<div className="braft-output-content text-justify" dangerouslySetInnerHTML={this.createMarkup()} />
						</div>
					)}
					<div className="w-full flex flex-wrap my-5">
						{image &&
							image.map((imgSrc, i) => (
								<div className="w-full my-5 text-center bg-gray-800" key="i">
									<Zoom>
									<Img
										className={typeOf == 'comic' ? "w-full object-cover" : "w-full object-contain max-h-500"}
										src={`https://i.imgur.com/${imgSrc}l.png`}
										alt="Post"
										loader={<img src={LoaderSvg} className="h-20 mx-auto" />}
									/>
									</Zoom>
								</div>
							))}
					</div>
					{isAuthenticated().user &&
						isAuthenticated().user._id === postedBy._id && (
						<div className="w-full text-right">
							<Link
								to={`/post/edit/${_id}`}
								className="px-2 py-1 text-gray-700 font-semibold tracking-wider bg-yellow-400 border-2 border-yellow-500 rounded text-sm hover:bg-yellow-500 mb-3 mr-4"
							>
								<i className="fas fa-pen mr-1"></i>Edit
							</Link>
							<button
								onClick={this.checkDeletePost}
								className="px-2 py-1 text-gray-700 font-semibold tracking-wider bg-pink-400 border-2 border-pink-500 rounded text-sm hover:bg-pink-500 mb-3"
							>
								<i className="fas fa-trash-restore-alt mr-1"></i>Delete
							</button>
						</div>
						)}
						{isAuthenticated().user &&
							isAuthenticated().user.role === "admin" && (
							<div className="w-full my-5">
								<Link
									to={`/post/edit/${_id}`}
									className="px-4 py-1 bg-gray-700 border-2 border-gray-600 rounded-full text-white m-2 text-xs"
								>
									Admin Edit
								</Link>
								<button
									onClick={this.checkDeletePost}
									className="px-4 py-1 bg-gray-700 border-2 border-gray-600 rounded-full text-white m-2 text-xs"
								>
									Admin Delete
								</button>
							</div>
							)}
					<div className="w-full border-t border-b pt-4 pb-8 my-4 border-gray-400 shadow-sm">
						<div className="flex">
							<div className="w-1/2 relative">
								<button
									onClick={liking ? (e) => e.preventDefault() : this.likeToogle}
									className={like ? "border border-yellow-400 rounded-full p-1" : "border border-white rounded-full p-1"}
								>
									{liking && <img src={LoaderSvg} className="h-10 mx-auto" />}
									{!liking && <img src={like ? Clapping : Clap} alt="clap" className={like ? "h-10 mx-auto" :  "h-10 p-1 mx-auto"} />}
								</button>
								<span className={like ? "absolute text-xl text-yellow-400 left-0 top-0 ml-12 pl-4 mt-1" : "absolute text-xl text-gray-500 left-0 top-0 ml-12 pl-4 mt-1"}>
									{likes.length < 10 ? `0${likes.length}` : `${likes.length}`}
								</span>
								{like ? (
									<span className="absolute bottom-0 left-0 text-xs -mb-5 text-yellow-400">
										You Clapped this post !
									</span>
								) : (
									<span className="absolute bottom-0 left-0 text-xs -mb-5 text-gray-500">
										Clap this post
									</span>
								)}
							</div>
							<div className="w-1/2 relative">
								<Link to={`/user/${postedBy._id}`}>
									<Img
										src={`https://i.imgur.com/${postedBy.avatar}s.png`}
										alt="Avatar"
										className="h-10 w-10 rounded-full object-cover border-2 border-gray-800 shadow absolute top-0 right-0 mt-2"
									/>
									<span className="absolute top-0 right-0 mt-3 mr-12 text-sm text-white">
										{postedBy.name}
									</span>
									<span className="absolute top-0 right-0 mt-8 mr-12 text-xs text-white">
										Member Since {new Date(postedBy.created).getFullYear()}
									</span>
								</Link>
							</div>
						</div>
					</div>
					<div className="w-full">
						<Comment postId={_id} ownerId={postedBy._id} comments={comments} updateComments={this.updateComments} />
					</div>
				</div>
				</div>
				<LoadingModal trigger={initializing} text="INITIALIZING" />
				<Modal
					isOpen={check}
					contentLabel="Minimal Modal Example"
					className="border-0 bg-transparent max-w-lg mx-auto mt-10"
				>
					<div
						className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
						style={{ marginTop: 150 }}
					>
						<div className="my-5">
							<h1 className="text-2xl text-white font-semibold pb-5">Warning !</h1>
							<p className="text-sm text-white">Do you really want to delete this post ?</p>
						</div>
						<div className="mt-10 mb-5">
							<button className="px-3 py-2 mr-2 rounded bg-white font-semibold" onClick={this.deletePost}>
								Delete
							</button>
							<button
								className="px-3 py-2 ml-2 rounded bg-white font-semibold"
								onClick={this.cancelDeletePost}
							>
								Cancel
							</button>
						</div>
					</div>
				</Modal>
			</AdLayout>
			</>
		);
	}
}

export default SinglePost;
