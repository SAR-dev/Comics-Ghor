import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { imageupload, create } from './apiCat';
import { Redirect } from 'react-router-dom';
import PrimaryLayout from '../core/PrimaryLayout';
import Modal from 'react-modal';
import LoadingModal from '../core/LoadingModal';
import TextareaAutosize from 'react-textarea-autosize';
import Img from 'react-image';
import LoaderSvg from '../images/rings.svg';

class NewCategory extends Component {
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
		this.setState({ showModal: false, imageError: false, error: '' });
	}

	componentDidMount() {
		this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
        if (isAuthenticated().user.role !== "admin"){
            this.setState({redirectToHome: true})
        }
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
        if (this.state.nameError || this.state.summaryError || this.state.image.length < 1) {
            this.setState({loading: false, error: 'Please fill up all the fields'})
        } else {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
    
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
        }
		
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
			<h1 className="text-2xl tracking-wide font-semibold text-gray-700 my-3">CREATE CATEGORY</h1>
			<div className="relative w-full mb-3">
				<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category Name:</label>
				<input
					value={name}
					onChange={this.handleName('name')}
					spellCheck="false"
					type="text"
					className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
					placeholder="Category Name"
					style={{ transition: 'all 0.15s ease 0s' }}
				/>
				<span className={nameError ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
					Name is required and should not exceed 100 characters
				</span>
			</div>
			<div className="relative w-full mb-3">
				<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category Policy:</label>
				<TextareaAutosize
					placeholder="Write a policy for this category..."
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
							<h4 className="text-gray-600 text-xl">Click and Upload Image</h4>
						</div>
					</div>
				)}
			</div>
			<div className="relative w-full mb-3">
				<button
					onClick={this.clickSubmit}
					className={
						!loading && !uploading ? (
							'w-full rounded bg-gray-800 hover:bg-gray-900 py-2 text-gray-100 uppercase tracking-wide font-semibold'
						) : (
							'hidden'
						)
					}
				>
					Submit
				</button>
				<button
					className={
						loading || uploading ? (
							'w-full rounded bg-gray-800 hover:bg-gray-900 py-2 text-gray-100 uppercase tracking-wide font-semibold'
						) : (
							'hidden'
						)
					}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						style={{ margin: 'auto', background: 'none', display: 'block' }}
						width="18px"
						height="18px"
						viewBox="0 0 100 100"
						preserveAspectRatio="xMidYMid"
					>
						<circle cx={50} cy={50} r={30} stroke="#001f2d" strokeWidth={10} fill="none" />
						<circle
							cx={50}
							cy={50}
							r={30}
							stroke="#008fd4"
							strokeWidth={8}
							strokeLinecap="round"
							fill="none"
							transform="rotate(108.569 50 50)"
						>
							<animateTransform
								attributeName="transform"
								type="rotate"
								repeatCount="indefinite"
								dur="1s"
								values="0 50 50;180 50 50;720 50 50"
								keyTimes="0;0.5;1"
							/>
							<animate
								attributeName="stroke-dasharray"
								repeatCount="indefinite"
								dur="1s"
								values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882"
								keyTimes="0;0.5;1"
							/>
						</circle>
					</svg>
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

export default NewCategory;
