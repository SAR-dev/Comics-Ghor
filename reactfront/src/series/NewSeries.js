import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { imageupload, create } from './apiSeries';
import { Redirect } from 'react-router-dom';
import PrimaryLayout from '../core/PrimaryLayout';
import Modal from 'react-modal';
import LoadingModal from '../core/LoadingModal';
import TextareaAutosize from 'react-textarea-autosize';
import Img from 'react-image';
import LoaderSvg from '../images/rings.svg';

class NewSeries extends Component {
	constructor() {
		super();
		this.handleImage = this.handleImage.bind(this);
		this.state = {
			name: '',
			nameError: true,
			summary: '',
			summaryError: true,
			image: '',
			imageError: false,
			error: '',
			uploading: false,
			loading: false,
			user: {},
			redirectToHome: false,
			showModal: false
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
		this.postData = new FormData();
		this.setState({ user: isAuthenticated().user });
	}

	handleName = () => (event) => {
		if (event.target.value.length < 1 || event.target.value.length > 100) {
			this.setState({ nameError: true, name: event.target.value });
			this.postData.set('name', event.target.value);
		} else {
			this.setState({ nameError: false, name: event.target.value });
			this.postData.set('name', event.target.value);
		}
	};

	handleSummary = () => (event) => {
		if (event.target.value.length < 1) {
			this.setState({ summaryError: true, summary: event.target.value });
			this.postData.set('summary', event.target.value);
		} else {
			this.setState({ summaryError: false, summary: event.target.value });
			this.postData.set('summary', event.target.value);
		}
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
			imageupload(img).then((res) => {
				this.setState({ image: res.data.id, imageError: false, uploading: false });
				this.postData.set('image', res.data.id);
			});
		}
	}

	deleteImage = (e, i) => {
		e.preventDefault();
		this.setState({ image: '' });
		this.postData.set('image', '');
	};

	redirectToHome = () => {
		this.setState({ redirectToHome: true });
	};

	resetError = () => {
		this.setState({ error: '', loading: false });
	};

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		this.postData.set('shortSummary', this.state.summary.slice(0,200))

		create(userId, token, this.postData).then((data) => {
			if (data.error) {
				this.setState({ loading: true, error: data.error });
			} else {
				this.setState({
					name: '',
					nameError: true,
					summary: '',
					summaryError: true,
					image: '',
					imageError: false,
					error: '',
					uploading: false,
					loading: false,
					user: {},
					redirectToHome: true
				});
			}
		});
	};

	createPost = (
		name,
		summary,
		image,
		nameError,
		summaryError,
		imageError,
		uploading,
		loading,
	) => (
		<form className="p-4">
			<h1 className="text-2xl tracking-wide font-semibold text-white my-3">CREATE SERIES</h1>
			<div className="relative w-full mb-3">
				<label className="block uppercase tracking-wide text-cream text-xs font-bold mb-2">Series Name:</label>
				<input
					value={name}
					onChange={this.handleName('name')}
					spellCheck="false"
					type="text"
					className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
					placeholder="Series Name"
					style={{ transition: 'all 0.15s ease 0s' }}
				/>
				<span className={nameError ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
					Name is required and should not exceed 100 characters
				</span>
			</div>
			<div className="relative w-full mb-3">
				<label className="block uppercase tracking-wide text-cream text-xs font-bold mb-2">Series Summary:</label>
				<TextareaAutosize
					placeholder="Write a summary for your series..."
					value={summary}
					type="text"
					className="h-32 resize-y px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
					onChange={this.handleSummary('summary')}
					minRows="5"
					style={{ transition: 'all 0.15s ease 0s' }}
				/>
				<span className={summaryError ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
					Do you really want to leave it empty?
				</span>
			</div>

			<div className="flex relative w-full mb-3">
				{image.length > 1 && (
					<div className="flex-1">
						<div className="relative hover:opacity-50 cursor-pointer mx-2 text-center">
							<Img
								className="w-full h-48 rounded object-contain"
								src={`https://i.imgur.com/${image}l.jpg`}
								onClick={(e) => this.deleteImage(e)}
								alt="upload"
								loader={<img src={LoaderSvg} className="h-48 mx-auto" />}
							/>
							<span className="text-xs text-gray-600">Click to remove</span>
						</div>
					</div>
				)}
				{image.length < 1 && (
					<div className="flex-1 border border-dashed border-gray-500 relative">
						<input
							type="file"
							accept="image/*"
							className={
								uploading || imageError ? (
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
							<h4 className="text-gray-600 text-xl">Click and Upload Cover</h4>
						</div>
					</div>
				)}
			</div>
			<div className="relative w-full mb-3">
				<button
					onClick={this.clickSubmit}
					className="w-full rounded bg-gray-800 py-2 text-white uppercase tracking-wide font-semibold"
				>
					Submit
				</button>
			</div>
		</form>
	);

	render() {
		const {
			name,
			summary,
			image,
			nameError,
			summaryError,
			imageError,
			error,
			uploading,
			loading,
			user,
			redirectToHome
		} = this.state;
		if (redirectToHome) {
			return <Redirect to={'/series'} />;
		}
		return (
			<PrimaryLayout>
				<div
					className={
						imageError || uploading ? (
							'pointer-events-none max-w-screen-md mx-auto'
						) : (
							'max-w-screen-md mx-auto'
						)
					}
				>
					{this.createPost(
						name,
						summary,
						image,
						nameError,
						summaryError,
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
				</div>
			</PrimaryLayout>
		);
	}
}

export default NewSeries;
