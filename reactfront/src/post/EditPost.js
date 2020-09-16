import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { imageupload, singlePost, update, listSeries, listCat } from './apiPost';
import { Redirect } from 'react-router-dom';
import PrimaryLayout from '../core/PrimaryLayout';
import Modal from 'react-modal';
import LoadingModal from '../core/LoadingModal';
import CKUpdaterComponent from '../editor/ck-updater';
import {isMobile} from 'react-device-detect';
import CGSNEditor from '../editor/braft-updater';

class EditPost extends Component {
	constructor() {
		super();
		this.handleImage = this.handleImage.bind(this);
		this.state = {
			id: '',
			title: '',
			titleError: false,
			body: '',
			bodyError: false,
			image: [],
			imageError: false,
			error: '',
			uploading: false,
			loading: false,
			user: {},
			redirectToHome: false,
			series: [],
			cat: [],
			catOf: '',
			seriesOf: '',
			showModal: false,
			initializing: true
		};
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false, imageError: false });
	}

	componentDidMount() {
		this.updatepostData = new FormData();
		const postId = this.props.match.params.postId;
		this.init(postId);
		listSeries().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ series: data.series });
			}
		});
		listCat().then((data) => {
			console.log(data)
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ cat: data.cat });
			}
		});
	}

	init = (postId) => {
		singlePost(postId).then((data) => {
			if (data.error) {
				this.setState({ redirectToHome: true });
			} else {
				if (isAuthenticated().user._id === data.postedBy._id || isAuthenticated().user.role === "admin") {
					if (data.image.length > 0) {
						const image = data.image[0].split(',');
						this.setState({
							id: data._id,
							title: data.title,
							body: data.body,
							image: image,
							seriesOf: data.seriesOf._id,
							catOf: data.catOf._id,
							initializing: false
						});
					} else {
						this.setState({
							id: data._id,
							title: data.title,
							body: data.body,
							seriesOf: data.seriesOf._id,
							catOf: data.catOf._id,
							initializing: false
						});
					}
				} else {
					this.setState({ redirectToHome: true });
				}
			}
		});
	};

	handleTitle = () => (event) => {
		if (event.target.value.length < 1 || event.target.value.length > 100) {
			this.setState({ titleError: true, title: event.target.value });
			this.updatepostData.set('title', event.target.value);
		} else {
			this.setState({ titleError: false, title: event.target.value });
			this.updatepostData.set('title', event.target.value);
		}
	};

	handleBody = (htmldata) => {
		if (htmldata.length === 0) {
			this.setState({ bodyError: true, body: htmldata });
			this.updatepostData.set('body', htmldata);
		} else {
			this.setState({ bodyError: false, body: htmldata });
			this.updatepostData.set('body', htmldata);
		}
	};

	handleTextBody = () => (event) => {
		if (event.target.value.length === 0) {
			this.setState({ bodyError: true, body: event.target.value });
			this.updatepostData.set('body', event.target.value);
		} else {
			this.setState({ bodyError: false, body: event.target.value });
			this.updatepostData.set('body', event.target.value);
		}
	};

	handleSeriesOf = (event) => {
		this.setState({ seriesOf: event.target.value });
		this.updatepostData.set('seriesOf', event.target.value);
	};

	handleCatOf = (event) => {
		this.setState({ catOf: event.target.value });
		this.updatepostData.set('catOf', event.target.value);
	};

	handleImage(event) {
		this.setState({ uploading: true });
		var fileInput = false;
		if (!event.target.files[0] || event.target.files[0].size > 19922944) {
			this.setState({ imageError: true, uploading: false });
		}
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			var img = event.target.files[0];
			imageupload(img)
				.then((res) => {
					if (res.data.error){
						this.setState({uploading: false ,error: res.data.error.message})
					} else {
						let imgArray = this.state.image;
						imgArray.push(res.data.id);
						this.setState({ image: imgArray, imageError: false, uploading: false });
						this.updatepostData.set('image', imgArray);
					}
				})
		}
	}

	deleteImage = (e, i) => {
		e.preventDefault();
		let imgList = this.state.image;
		imgList.splice(i, 1);
		this.setState({ image: imgList });
		this.updatepostData.set('image', imgList);
	};

	redirectToHome = () => {
		this.setState({ redirectToHome: true });
	};

	resetError = () => {
		this.setState({ error: '', loading: false });
	};

	imageArray = () => {
		return this.state.image.map((image, i) => {
			return (
				<div className="w-1/2 md:w-1/3 mb-2 hover:opacity-50 cursor-pointer px-1" key={i}>
					<img
						className="w-full h-32 lg:h-48 rounded object-contain bg-gray-400 px-2"
						src={`https://i.imgur.com/${image}l.jpg`}
						onClick={(e) => this.deleteImage(e, i)}
					/>
					<span className="text-xs text-gray-600 px-2">Click to remove</span>
				</div>
			);
		})
	}

	decodeEntities = (function() {
		// this prevents any overhead from creating the object each time
		var element = document.createElement('div');
	  
		function decodeHTMLEntities (str) {
		  if(str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
			element.innerHTML = str;
			str = element.textContent;
			element.textContent = '';
		  }
	  
		  return str;
		}
	  
		return decodeHTMLEntities;
	  })();

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		const postId = this.state.id;
		const token = isAuthenticated().token;
		this.updatepostData.set('thumbnail', this.state.image[0]);
		var htmlToText = this.decodeEntities(this.state.body)
		this.updatepostData.set('summary', htmlToText.slice(0, 250));
		update(postId, token, this.updatepostData).then((data) => {
			if (data.error) {
				this.setState({ loading: true, error: data.error });
			} else {
				this.setState({
					title: '',
					titleError: false,
					body: '',
					bodyError: false,
					image: [],
					imageError: false,
					error: '',
					uploading: false,
					loading: false,
					user: {},
					redirectToHome: true,
					series: [],
					seriesOf: ''
				});
			}
		});
	};

	createPost = (series, cat, title, body, image, titleError, bodyError, imageError, error, uploading, loading) => (
		<form className="p-4">
			<h1 className="text-2xl tracking-wide font-semibold text-white my-3">UPDATE POST</h1>
			<div className="relative w-full mb-3">
				<input
					value={title}
					onChange={this.handleTitle('title')}
					spellCheck="false"
					type="text"
					className="px-3 py-3 placeholder-gray-500 text-dark bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
					placeholder="Give an awesome title"
					style={{ transition: 'all 0.15s ease 0s' }}
				/>
				<span className='text-gray-600 text-sm'>
					Title is required and should not exceed 100 characters
				</span>
			</div>
			<div className="relative w-full mb-3">
				{isMobile && (
					<CKUpdaterComponent value={this.state.body} data={this.handleBody.bind(this)} />
				)}
				{!isMobile && (
					<div className="shadow bg-gray-800 rounded">
						<CGSNEditor value={this.state.body} data={this.handleBody.bind(this)} />
					</div>
				)}
				<span className='text-gray-600 text-sm'>
					Body is required
				</span>
			</div>
			<div className="relative w-full my-3">
			<label className="block uppercase tracking-wide text-cream text-xs font-bold mb-2">Select Series:</label>
				<select
					className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-state"
					value={this.state.seriesOf}
					onChange={this.handleSeriesOf}
				>
					<option selected hidden>
						Select a Series
					</option>
					{series.map((item, i) => {
						return (
							<option value={item._id} key={i}>
								{item.name}
							</option>
						);
					})}
				</select>
				<span className='text-gray-600 text-sm'>
					Select "None" if you don't want to add this post to any series.
				</span>
			</div>
			<div className="relative w-full my-3">
			<label className="block uppercase tracking-wide text-cream text-xs font-bold mb-2">Select Category:</label>
				<select
					className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-state"
					value={this.state.catOf}
					onChange={this.handleCatOf}
				>
					<option defaultValue hidden>
						Select a Category
					</option>
					{cat.map((item, i) => {
						return (
							<option value={item._id} key={i}>
								{item.name}
							</option>
						);
					})}
				</select>
				<span className={this.state.catOf === '' ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
					Category is required
				</span>
			</div>
			<div className="relative w-full mb-3">
				<div className="flex flex-wrap my-2 justify-start">{this.imageArray()}</div>
				<div className="border border-dashed border-gray-500 relative">
					<input
						type="file"
						accept="image/*"
						className={
							uploading ? (
								'pointer-events-none relative block opacity-0 w-full h-full p-20 z-50'
							) : (
								'cursor-pointer relative block opacity-0 w-full h-full p-20 z-50'
							)
						}
						onChange={this.handleImage}
						id="image-input"
					/>
					<div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">
						<i className="fas fa-camera text-5xl text-gray-500" />
						<h4 className="text-gray-600 text-xl">Click and select image to upload</h4>
					</div>
				</div>
				<span className="text-gray-600 text-sm">Upload images</span>
			</div>
			<div className="relative w-full mb-3">
				<button
					onClick={this.clickSubmit}
					className="w-full rounded bg-gray-800 py-2 text-gray-100 uppercase tracking-wide font-semibold"
				>
					Update Post
				</button>
			</div>
		</form>
	);

	render() {
		const {
			series,
			cat,
			title,
			body,
			image,
			titleError,
			bodyError,
			imageError,
			error,
			uploading,
			loading,
			user,
			redirectToHome,
			initializing
		} = this.state;
		if (redirectToHome) {
			return <Redirect to={'/'} />;
		}
		return (
			<PrimaryLayout>
				<div
					className={
						imageError || uploading ? (
							'pointer-events-none max-w-screen-lg mx-auto'
						) : (
							'max-w-screen-lg mx-auto'
						)
					}
				>
					{this.createPost(
						series,
						cat,
						title,
						body,
						image,
						titleError,
						bodyError,
						imageError,
						error,
						uploading,
						loading,
						user,
						redirectToHome
					)}
					<Modal
						isOpen={imageError}
						contentLabel="Minimal Modal Example"
						className="border-0 bg-transparent max-w-lg mx-auto mt-10"
					>
						<div
							className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
							style={{ marginTop: 150 }}
						>
							<div className="my-5">
								<h1 className="text-2xl text-white font-semibold pb-5">Image Upload Error !</h1>
								<p className="text-sm text-white">Size of the selected image is too big</p>
							</div>
							<div className="mt-10 mb-5">
								<button
									className="px-3 py-2 rounded bg-white font-semibold"
									onClick={this.handleCloseModal}
								>
									GOT IT
								</button>
							</div>
						</div>
					</Modal>
					<Modal
						isOpen={error.length > 0}
						contentLabel="Minimal Modal Example"
						className="border-0 bg-transparent max-w-lg mx-auto mt-10"
					>
						<div
							className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
							style={{ marginTop: 150 }}
						>
							<div className="my-5">
								<h1 className="text-2xl text-white font-semibold pb-5">Sumbmission Error !</h1>
								<p className="text-sm text-white">{`${error}`}</p>
							</div>
							<div className="mt-10 mb-5">
								<button
									className="px-3 py-2 rounded bg-white font-semibold"
									onClick={this.handleCloseModal}
								>
									GOT IT
								</button>
							</div>
						</div>
					</Modal>
					<LoadingModal trigger={uploading} text="UPLOADING" />
					<LoadingModal trigger={loading} text="SUBMITTING..." />
					<LoadingModal trigger={initializing} text="INITIALIZING" />
				</div>
			</PrimaryLayout>
		);
	}
}

export default EditPost;
