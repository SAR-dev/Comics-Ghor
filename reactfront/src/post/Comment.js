import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth/auth';
import { Link, Redirect } from 'react-router-dom';
import Moment from 'react-moment';
import { imageupload } from './apiPost';
import TextareaAutosize from 'react-textarea-autosize';
import { toArray } from 'react-emoji-render';
import Img from 'react-image';
import Modal from 'react-modal';
import LoadingModal from '../core/LoadingModal';
import Zoom from 'react-medium-image-zoom';
import LoaderSvg from '../images/rings.svg';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.handleImageUp = this.handleImageUp.bind(this);
		this.state = {
			text: '',
			image: '',
			imageError: '',
			uploading: false,
			error: '',
			confirm: false,
			commentDel: '',
			unauthorized: false,
			commenting: false
		};
	}

	parseEmojis = (value) => {
		const emojisArray = toArray(value);

		// toArray outputs React elements for emojis and strings for other
		const newValue = emojisArray.reduce((previous, current) => {
			if (typeof current === 'string') {
				return previous + current;
			}
			return previous + current.props.children;
		}, '');

		return newValue;
	};

	handleChange = (event) => {
		this.setState({ text: event.target.value });
	};

	addComment = (e) => {
		e.preventDefault();
		this.setState({commenting: true})
		if (isAuthenticated()) {
			const userId = isAuthenticated().user._id;
			const postId = this.props.postId;
			const ownerId = this.props.ownerId;
			const token = isAuthenticated().token;

			comment(userId, token, postId, { text: this.state.text, image: this.state.image }, ownerId).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					this.setState({ text: '', image: '', commenting: false });
					this.props.updateComments(data.comments);
				}
			});
		} else {
			this.setState({unauthorized: true})
		}
		
	};

	confirmDeleteComment = (comment) => {
		this.setState({ confirm: true, commentDel: comment });
	};

	cancelDeleteComment = () => {
		this.setState({ confirm: false });
	};

	handleImageUp(event) {
		this.setState({ uploading: true });
		var fileInput = false;
		if (!event.target.files[0] || event.target.files[0].size > 19922944) {
			this.setState({
				imageError: true,
				uploading: false
			});
		}
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			var img = event.target.files[0];
			imageupload(img).then((res) => {
				this.setState({
					image: res.data.id,
					imageError: false,
					uploading: false
				});
			});
		}
	}

	compareValues = (key, order = 'asc') => {
		return function innerSort(a, b) {
		  if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
			// property doesn't exist on either object
			return 0;
		  }
	  
		  const varA = (typeof a[key] === 'string')
			? a[key].toUpperCase() : a[key];
		  const varB = (typeof b[key] === 'string')
			? b[key].toUpperCase() : b[key];
	  
		  let comparison = 0;
		  if (varA > varB) {
			comparison = 1;
		  } else if (varA < varB) {
			comparison = -1;
		  }
		  return (
			(order === 'desc') ? (comparison * -1) : comparison
		  );
		};
	  }

	deleteComment = () => {
		const userId = isAuthenticated().user._id;
		const postId = this.props.postId;
		const token = isAuthenticated().token;
		const ownerId = this.props.ownerId;

		uncomment(userId, token, postId, this.state.commentDel, ownerId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.props.updateComments(data.comments);
				this.setState({ confirm: false });
			}
		});
	};

	render() {
		const { comments } = this.props;
		const { confirm, uploading, unauthorized, commenting } = this.state;
		if (unauthorized) {
			return <Redirect to={'/signin'} />;
		}

		return (
			<div className="flex flex-wrap my-5">
				<div className="w-full">
					<form className="mb-5">
						<h1 className="text-xl font-bold tracking-widest text-white uppercase mb-5">
							<i className="fas fa-comment-alt mr-2" />
							Comment
						</h1>
						{!this.state.image && (
							<div className="border border-dashed border-gray-500 h-32 w-32 relative mb-4">
								<input
									type="file"
									accept="image/*"
									className={
										uploading ? (
											'pointer-events-none relative block opacity-0 w-full h-full z-50'
										) : (
											'cursor-pointer relative block opacity-0 w-full h-full z-50'
										)
									}
									onChange={this.handleImageUp}
									id="image-input"
								/>
								<div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">
									<i className="fas fa-camera text-5xl text-gray-300" />
								</div>
							</div>
						)}
						{this.state.image && (
							<div className="d-inline-block image-uploaded mb-1">
								<img
									onClick={() => {
										this.setState({ image: '' });
									}}
									src={`https://i.imgur.com/${this.state.image}m.png`}
									alt="Comment"
									style={{ height: '7rem' }}
									className="rounded hover:opacity-50"
								/>
								<span className="text-xs text-white">Click image to remove</span>
							</div>
						)}
						<TextareaAutosize
							placeholder="Leave a comment"
							value={this.state.text}
							type="text"
							className="h-32 mb-1 px-3 py-3 placeholder-gray-500 text-gray-700 bg-white rounded text-sm focus:outline-none focus:shadow-outline w-full"
							onChange={this.handleChange}
						/>
						{!this.state.text && !this.state.image ? (
							<button
								className="px-3 py-1 bg-blue-500 rounded text-sm text-white pointer-events-none opacity-50"
							>
								<i className="fas fa-share mr-1" />Submit
							</button>
						) : (
							<button
								onClick={commenting ? (e) => e.preventDefault() : this.addComment}
								className="px-3 py-1 bg-blue-600 rounded text-sm text-white hover:bg-blue-700"
							>
								<i className="fas fa-share mr-1" />Submit
							</button>
						)}
					</form>
				</div>
				{comments.sort(this.compareValues('_id', 'desc')) && comments.map((comment, i) => (
					<div className="w-full my-2 pt-2 pb-6 border-dashed border-b border-gray-500 relative" key={i}>
						<div className="flex">
							<div className="w-16">
								<Link to={`/user/${comment.postedBy._id}`}>
									<img
										src={`https://i.imgur.com/${comment.postedBy.avatar}s.png`}
										alt=""
										className="w-10 h-10 rounded-full border border-gray-500 object-cover"
									/>
								</Link>
							</div>
							<div className="flex-1 whitespace-pre-wrap">
								<Link to={`/user/${comment.postedBy._id}`}>
									<h1 className="text-blue-500 text-sm font-bold hover:text-blue-700 mb-1">
										{comment.postedBy.name}
									</h1>
								</Link>
								{comment.image.length > 0 && (
									<Img
										src={`https://i.imgur.com/${comment.image}m.png`}
										className="rounded mb-1"
										loader={<img src={LoaderSvg} className="h-40" />}
									/>
								)}
								<h6 className="text-cream text-sm">{this.parseEmojis(comment.text)}</h6>
							</div>
						</div>
						<div className="absolute top-0 right-0 text-xs text-cream">
							<Moment fromNow>{new Date(comment.created)}</Moment>
						</div>
						{isAuthenticated().user &&
						isAuthenticated().user._id === comment.postedBy._id && (
							<div className="absolute bottom-0 right-0">
								<button
									onClick={() => this.confirmDeleteComment(comment)}
									className="text-xs text-gray-300"
								>
									<i className="fas fa-minus-circle mr-1" />
									DELETE
								</button>
							</div>
						)}
					</div>
				))}
				<Modal
					isOpen={confirm}
					contentLabel="Minimal Modal Example"
					className="border-0 bg-transparent max-w-lg mx-auto mt-10"
				>
					<div
						className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
						style={{ marginTop: 150 }}
					>
						<div className="my-5">
							<h1 className="text-2xl text-white font-semibold pb-5">Warning !</h1>
							<p className="text-sm text-white">Do you really want to delete this comment ?</p>
						</div>
						<div className="mt-10 mb-5">
							<button
								className="px-3 py-2 mr-2 rounded bg-white font-semibold"
								onClick={this.deleteComment}
							>
								Delete
							</button>
							<button
								className="px-3 py-2 ml-2 rounded bg-white font-semibold"
								onClick={this.cancelDeleteComment}
							>
								Cancel
							</button>
						</div>
					</div>
				</Modal>
				<LoadingModal trigger={uploading} text="UPLOADING" />
			</div>
		);
	}
}

export default Comment;
