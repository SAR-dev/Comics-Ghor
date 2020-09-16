import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { like, unlike } from './apiPost';
import LazyLoad from 'react-lazyload';
import { isAuthenticated } from '../auth/auth';
import Clap from '../images/clap/clap_bg-none.svg';
import Clapping from '../images/clap/clapping_bg-none.svg';
import Img from 'react-image';
import LoaderSvg from '../images/rings.svg';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import TextareaAutosize from 'react-textarea-autosize';
import Moment from 'react-moment';
import { comment } from './apiPost';

export default class PostCard extends Component {
	constructor() {
		super();
		this.state = {
			like: false,
			redirectToSignin: false,
			likes: '',
			commentsCount: '',
			loading: false,
			text: '',
			show: false,
			submitting: false,
			liking: false,
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		let count
		if (this.props.post.commentsCount === []){
			count = 0
		} else {
			count = this.props.post.commentsCount.reduce((a, b) => a + b, 0)
		}
		this.setState({
			like: this.checkLike(this.props.post.likes),
			likes: this.props.post.likes.length,
			commentsCount: count
		});
	}


	checkLike = (likes) => {
		const userId = isAuthenticated() && isAuthenticated().user._id;
		let match = likes.indexOf(userId) !== -1;
		return match;
	};

	getFirstImage = (images) => {
		if (images) {
			const imageFirst = images.split(',');
			return imageFirst[0];
		} else {
			return false;
		}
	};

	likeToogle = () => {
		this.setState({liking: true})
		if (!isAuthenticated()) {
			this.setState({ redirectToSignin: true });
			return false;
		}
		this.setState({ loading: true });
		let callApi = this.state.like ? unlike : like;
		const userId = isAuthenticated().user._id;
		const postId = this.props.post._id;
		const ownerId = this.props.post.postedBy._id;
		const token = isAuthenticated().token;
		callApi(userId, token, postId, ownerId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({
					like: !this.state.like,
					liking: false
				});
				this.state.like
					? this.setState({ likes: this.state.likes + 1, loading: false })
					: this.setState({ likes: this.state.likes - 1, loading: false });
			}
		});
	};

	addComment = (e) => {
		e.preventDefault();
		this.setState({submitting: true})
		const userId = isAuthenticated().user._id;
		const postId = this.props.post._id;
		const token = isAuthenticated().token;
		const ownerId = this.props.post.postedBy._id;
		if (this.state.text.length > 0){
			comment(userId, token, postId, { text: this.state.text, image: '' }, ownerId).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					this.setState({ text: '', show: false, submitting: false, commentsCount: this.state.commentsCount + 1});
				}
			});
		}
		
	};

	swap = () => {
		if (isAuthenticated()){
			this.setState({show: !this.state.show})
		} else {
			this.setState({redirectToSignin: true})
		}
	}

	render() {
		const { post } = this.props;
		if (this.state.redirectToSignin) {
			return <Redirect to={'/signin'} />;
		}
		const { like, likes, loading, text, show, submitting, commentsCount, liking } = this.state;

		return (
			<div className="flex flex-wrap rounded shadow pt-2 bg-gray-800 border border-gray-900">
				<div className="w-1/2 text-left justify-content-start mt-2 mb-4 relative">
					<img
						src={`https://i.imgur.com/${post.postedBy.avatar}s.png`}
						className="ml-2 h-8 w-8 shadow rounded-full object-cover inline border border-white"
					/>
					<Link to={`/user/${post.postedBy._id}`} className="absolute top-0 left-0 text-white text-xs" style={{marginLeft: 47, marginTop: '-1px'}}>
						<h6 className="text-sm text-white hover:text-gray-500">
							{post.postedBy.name}
						</h6>
					</Link>
					<div className="absolute top-0 left-0 mt-4 text-white text-xs" style={{marginLeft: 47}}>
						{<Moment fromNow>{new Date(post.created)}</Moment>}
					</div>
				</div>
				{post.seriesOf._id !== `${process.env.REACT_APP_NONE_SERIES}` && (
				<div className="w-1/2 text-right justify-content-end mt-2 mb-4">
					<Link to={`/series/${post.seriesOf._id}`} className="mr-2 text-xs text-white hover:text-gray-500">
						<i className="fas fa-layer-group pr-2" />
						{post.seriesOf.name}
					</Link>
				</div>
				)}
				
				{post.thumbnail !== "undefined" &&(
				<div className="w-full text-center bg-gray-700 shadow-inner">
					<LazyLoad offset={100} once>
						<Zoom>
							<Img
								src={`https://i.imgur.com/${post.thumbnail}l.png`}
								className="w-full object-contain"
								style={{ maxHeight: 350 }}
								loader={<img src={LoaderSvg} className="h-48 mx-auto" />}
							/>
						</Zoom>
					</LazyLoad>
				</div>
				)}
				<div className="w-full p-2">
					<Link to={`/post/${post._id}`}>
						<h5 className={post.thumbnail == "undefined"  ? "text-2xl m-1 text-gray-100" : "text-lg m-1 text-gray-100"}>
							{post.title}
						</h5>
						{post.summary && (
							<div className="px-3 py-1 mx-1 my-2 border-l-2 border-gray-700 leading-wide text-justify" id="summary">
								<div className={post.thumbnail == "undefined"  ? "text-base text-white" : "text-xs text-white"}>{post.summary}...</div>
							</div>
						)}
					</Link>
				</div>
				<div className={show ? "w-full flex flex-wrap border-t border-b border-gray-900" : "w-full flex flex-wrap border-t border-gray-900"} >
					<div onClick={liking ? (e) => e.preventDefault() : this.likeToogle} style={{padding: "4px 0"}} className="w-1/2 my-auto border-r border-gray-900 cursor-pointer hover:bg-gray-700 rounded-bl text-white text-center text-xs tracking-wide">
						{loading && <img src={LoaderSvg} className="h-8 mx-auto inline" />}
						{!loading && (
							<Img
								src={like ? Clapping : Clap}
								className={like ? "h-8 p-1 mx-auto inline": "inline h-8 mx-auto p-1"}
							/>
						)}
						<span className="ml-2">{likes < 10 ? `0${likes}` : likes}</span>
					</div>
					<div onClick={this.swap} style={{padding: "10px 0"}} className="w-1/2 my-auto cursor-pointer hover:bg-gray-700 rounded-br text-white text-center text-xs tracking-wide">
						<i className="fas fa-reply-all text-lg"></i>
						<span className="ml-2">Comment</span>
						<span className="ml-2">{commentsCount < 10 ? `0${commentsCount}` : commentsCount}</span>
					</div>
				</div>
				{show && (
					<div className="w-full my-2 px-2">
						{submitting && <img src={LoaderSvg} className="h-20 mx-auto" />}
						{!submitting && (
							<>
							<TextareaAutosize
								placeholder="Leave a comment"
								value={text}
								type="text"
								className="h-32 px-3 py-3 placeholder-gray-500 bg-gray-900 text-white rounded text-sm focus:outline-none focus:shadow-outline w-full"
								onChange={(e) => this.setState({text: e.target.value})}
							/>
							<button
								onClick={this.addComment}
								className={text.length === 0 ? "pointer-events-none px-3 py-1 mt-1 bg-blue-600 rounded text-sm text-white hover:bg-blue-700" : "px-3 py-1 mt-1 bg-blue-600 rounded text-sm text-white hover:bg-blue-700"}
							>
								<i className="fas fa-share mr-1" />Submit
							</button>
							</>
						)}
					</div>
				)}
			</div>
		);
	}
}
