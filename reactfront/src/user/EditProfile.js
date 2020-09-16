import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { read, update, imageupload, updateUser } from './apiUser';
import { Redirect } from 'react-router-dom';
import PrimaryLayout from '../core/PrimaryLayout';
import Img from 'react-image';
import Modal from 'react-modal';
import LoadingModal from '../core/LoadingModal';
import LoaderSvg from '../images/rings.svg';

class EditProfile extends Component {
	constructor() {
		super();
		this.handleAvatar = this.handleAvatar.bind(this);
		this.handleCover = this.handleCover.bind(this);
		this.state = {
			id: '',
			name: '',
			fullname: '',
			password: '',
			avatar: '',
			cover: '',
			about: '',
			Sinstagram: '',
			Sfacebook: '',
			Stwitter: '',
			Syoutube: '',
			blood: '',
			contact: '',
			address: '',
			gender: '',
			nameError: false,
			passwordError: false,
			emailError: false,
			loading: false,
			avatarError: false,
			coverError: false,
			aboutError: false,
			error: '',
			redirectToProfile: false,
			redirectToHome: false,
			created: '',
			uploading: false,
			initializing: true,
			showModal: false,
		};
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false, avatarError: false, coverError: false });
	}

	componentDidMount() {
		const userId = this.props.match.params.userId;
		this.init(userId);
	}

	init = (userId) => {
		const token = isAuthenticated().token;
		read(userId, token).then((data) => {
			if (data.error) {
				this.setState({ redirectToProfile: true });
			} else {
				if (isAuthenticated().user._id === data._id || isAuthenticated().user.role === "admin") {
					this.setState({
						id: data._id,
						name: data.name,
						created: data.created,
						avatar: data.avatar,
						cover: data.cover,
						about: data.about,
						Sinstagram: data.Sinstagram,
						Sfacebook: data.Sfacebook,
						Stwitter: data.Stwitter,
						Syoutube: data.Syoutube,
						blood: data.blood,
						gender: data.gender,
						contact: data.contact,
						address: data.address,
						initializing: false,
						fullname: data.fullname,
					});
				} else {
					this.setState({redirectToHome: true})
				}
				
			}
		});
	};

	handleName = (name) => (event) => {
		if (event.target.value.length < 3 || event.target.value.length > 15) {
			this.setState({ nameError: true, name: event.target.value });
		} else {
			this.setState({ nameError: false, name: event.target.value });
		}
	};

	handleAbout = (about) => (event) => {
		if (event.target.value.length < 1) {
			this.setState({ aboutError: true, about: event.target.value });
		} else {
			this.setState({ aboutError: false, about: event.target.value });
		}
	};

	handleData = (i) => (event) => {
		this.setState({ [i]: event.target.value });
	};

	handleAvatar(event) {
		this.setState({ uploading: true });
		var fileInput = false;
		if (!event.target.files[0] || event.target.files[0].size > 19922944) {
			this.setState({ avatarError: true, uploading: false });
		}
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			var img = event.target.files[0];
			imageupload(img).then((res) => {
				this.setState({ avatar: res.data.id, avatarError: false, uploading: false });
			});
		}
	}

	handleCover(event) {
		this.setState({ uploading: true });
		var fileInput = false;
		if (!event.target.files[0] || event.target.files[0].size > 19922944) {
			this.setState({ coverError: true, uploading: false });
		}
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			var img = event.target.files[0];
			imageupload(img).then((res) => {
				this.setState({ cover: res.data.id, coverError: false, uploading: false });
			});
		}
	}

	handlePassword = (password) => (event) => {
		var re = /\d/;
		if ((event.target.value.length < 6 && event.target.value.length > 0) || !re.test(event.target.value)) {
			this.setState({ passwordError: true, password: event.target.value });
		} else {
			this.setState({ passwordError: false, password: event.target.value });
		}
	};

	redirectToProfile = () => {
		this.setState({ redirectToProfile: true });
	};

	resetError = () => {
		this.setState({ error: '', loading: false });
	};

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		const { name, fullname, password, avatar, cover, about, Sinstagram, Sfacebook, Stwitter, Syoutube, blood, gender, contact, address } = this.state;
		const user = {
			name,
			fullname,
			password: password || undefined,
			avatar,
			cover,
			about,
			Sinstagram,
			Sfacebook,
			Stwitter,
			Syoutube,
			blood, gender, contact, address
		};
		const userId = this.props.match.params.userId;
		const token = isAuthenticated().token;

		update(userId, token, user).then((data) => {
			if (data.error) {
				this.setState({ loading: true, error: data.error });
			} else if (isAuthenticated().user.role === "admin") {
				this.setState({redirectToProfile: true})
			} else {
				updateUser(data.user, () => {
					this.setState({
						redirectToProfile: true
					});
				});
			}
		});
	};

	render() {
		const {
			name,
			fullname,
			password,
			avatar,
			cover,
			Sinstagram,
			Sfacebook,
			Stwitter,
			Syoutube,
			contact,
			address,
			nameError,
			passwordError,
			avatarError,
			coverError,
			about,
			aboutError,
			loading,
			redirectToProfile,
			redirectToHome,
			id,
			error,
            initializing,
			uploading,
		} = this.state;
		if (redirectToProfile) {
			return <Redirect to={`/user/${id}`} />;
		}
		if (redirectToHome) {
			return <Redirect to="/" />;
		}
		return (
			<PrimaryLayout>
				<div className="max-w-screen-lg mx-auto">
					<form className="p-4">
						<h1 className="text-2xl tracking-wide font-semibold text-white my-3">UPDATE BIO</h1>

						<div className="max-w-screen-sm">
							<div className="h-48 md:h-64 lg-300 w-full relative mb-20">
								<Img
									src={`https://i.imgur.com/${cover}l.png`}
									alt="Cover"
									className="h-48 md:h-64 lg-300 w-full object-cover shadow"
									loader={ <img src={LoaderSvg} className="mx-auto h-48 md:h-64 lg-300" />}
								/>
								<Img
									src={`https://i.imgur.com/${avatar}m.png`}
									alt="Avatar"
									className="absolute ml-5 -mb-16 md:-mb-16 lg:-mb-16 border-4 border-gray-800 shadow-lg bottom-0 rounded-full h-32 w-32 object-cover"
									loader={ <img src={LoaderSvg} className="mx-auto absolute ml-5 md:-mb-16 lg:-mb-16 bottom-0 h-32" />}
								/>
							</div>
						</div>
						<div className="flex">
							<div className="relative w-1/2 mb-3 pr-5">
								<div className="flex-1 border border-dashed border-gray-500 relative">
									<input
										type="file"
										className={
											uploading || coverError || avatarError ? (
												'pointer-events-none relative block opacity-0 w-full h-full p-10 z-50'
											) : (
												'cursor-pointer relative block opacity-0 w-full h-full p-10 z-50'
											)
										}
										onChange={this.handleCover}
										id="image-input"
									/>
									<div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">
										<h4 className="text-gray-600 text-sm">Cover</h4>
									</div>
								</div>
								<span className={coverError ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
									Please upload a valid image with size less than 20MB
								</span>
							</div>

							<div className="relative w-1/2 mb-3 pl-5">
								<div className="flex-1 border border-dashed border-gray-500 relative">
									<input
										type="file"
										className={
											uploading || coverError || avatarError ? (
												'pointer-events-none relative block opacity-0 w-full h-full p-10 z-50'
											) : (
												'cursor-pointer relative block opacity-0 w-full h-full p-10 z-50'
											)
										}
										onChange={this.handleAvatar}
										id="image-input"
									/>
									<div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">
										<h4 className="text-gray-600 text-sm">Avatar</h4>
									</div>
								</div>
								<span className={avatarError ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
									Please upload a valid image with size less than 20MB
								</span>
							</div>
						</div>

						<div className="relative w-full mb-3">
							<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								Nickname
							</label>
							<input
								value={name}
								onChange={this.handleName('name')}
								spellCheck="false"
								type="text"
								className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
								placeholder="Nickname"
								style={{ transition: 'all 0.15s ease 0s' }}
							/>
							<span className={nameError ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
								Nickname should contain 3 to 15 characters
							</span>
						</div>

						<div className="relative w-full mb-3">
							<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								Full Name
							</label>
							<input
								value={fullname}
								onChange={this.handleData('fullname')}
								spellCheck="false"
								type="text"
								className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
								placeholder="Full Name"
								style={{ transition: 'all 0.15s ease 0s' }}
							/>
						</div>

						<div className="relative w-full mb-3">
							<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								About Yourself
							</label>
							<textarea
								value={about}
								onChange={this.handleAbout('about')}
								spellCheck="false"
								type="text"
								className="h-32 resize-y px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
								placeholder="Write something to introduce yourself to others"
								style={{ transition: 'all 0.15s ease 0s' }}
							/>
							<span className={aboutError ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
								Do you really want to leave it empty?
							</span>
						</div>

						<div className="relative w-full mb-3">
							<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								Address
							</label>
							<input
								value={address}
								onChange={this.handleData('address')}
								spellCheck="false"
								type="text"
								className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
								placeholder="XXX, XXX, BD"
								style={{ transition: 'all 0.15s ease 0s' }}
							/>
						</div>

						<div className="relative w-full mb-3">
							<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								Contact Number
							</label>
							<input
								value={contact}
								onChange={this.handleData('contact')}
								spellCheck="false"
								type="text"
								className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
								placeholder="01XXXXXXXXX"
								style={{ transition: 'all 0.15s ease 0s' }}
							/>
						</div>

						<div className="relative w-full mb-3">
							<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								Social Links
							</label>
							<div className="flex my-3">
								<h6 className="flex-auto text-3xl w-12 text-pink-700">
									<i className="fab fa-instagram" />
								</h6>
								<input
									autoComplete="new-password"
									value={Sinstagram}
									onChange={this.handleData('Sinstagram')}
									spellCheck="false"
									type="text"
									className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
									placeholder="https://www.instagram.com/xxxx"
									style={{ transition: 'all 0.15s ease 0s' }}
								/>
							</div>
							<div className="flex my-3">
								<h6 className="flex-auto text-3xl w-12 text-blue-700">
									<i className="fab fa-facebook" />
								</h6>
								<input
									autoComplete="new-password"
									value={Sfacebook}
									onChange={this.handleData('Sfacebook')}
									spellCheck="false"
									type="text"
									className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
									placeholder="https://www.facebook.com/xxxx"
									style={{ transition: 'all 0.15s ease 0s' }}
								/>
							</div>
							<div className="flex my-3">
								<h6 className="flex-auto text-3xl w-12 text-blue-500">
									<i className="fab fa-twitter" />
								</h6>
								<input
									autoComplete="new-password"
									value={Stwitter}
									onChange={this.handleData('Stwitter')}
									spellCheck="false"
									type="text"
									className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
									placeholder="https://twitter.com/xxxx"
									style={{ transition: 'all 0.15s ease 0s' }}
								/>
							</div>
							<div className="flex my-3">
								<h6 className="flex-auto text-3xl w-12 text-red-600">
									<i className="fab fa-youtube" />
								</h6>
								<input
									autoComplete="new-password"
									value={Syoutube}
									onChange={this.handleData('Syoutube')}
									spellCheck="false"
									type="text"
									className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
									placeholder="https://www.youtube.com/user/xxxx"
									style={{ transition: 'all 0.15s ease 0s' }}
								/>
							</div>
						</div>

						<div className="relative w-full mb-3">
						<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								Blood Broup
							</label>
							<select
								className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								id="grid-state"
								value={this.state.blood}
								onChange={this.handleData('blood')}
							>
								<option defaultValue hidden>
									Select Your Blood Group
								</option>
								{['A+', 'B+', 'AB+', 'AB-', 'O+', 'O-'].map((item, i) => {
									return (
										<option value={item} key={i}>
											{item}
										</option>
									);
								})}
							</select>
						</div>

						<div className="relative w-full mb-3">
						<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								Gender
							</label>
							<select
								className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								id="grid-state"
								value={this.state.gender}
								onChange={this.handleData('gender')}
							>
								<option defaultValue hidden>
									Select Your Gender
								</option>
								{['Male', 'Female', 'Other'].map((item, i) => {
									return (
										<option value={item} key={i}>
											{item}
										</option>
									);
								})}
							</select>
						</div>

						<div className="relative w-full mb-3">
							<label
								className="block uppercase tracking-wide text-cream text-xs font-bold mb-2"
							>
								Password
							</label>
							<input
								autoComplete="new-password"
								value={password}
								onChange={this.handlePassword('password')}
								spellCheck="false"
								type="password"
								className="px-3 py-3 placeholder-gray-500 text-gray-700 bg-gray-200 rounded text-sm focus:outline-none focus:shadow-outline w-full"
								placeholder="Update password or Leave it empty"
								style={{ transition: 'all 0.15s ease 0s' }}
							/>
							<span className={passwordError ? 'text-gray-600 text-sm' : 'text-transparent text-sm'}>
								Password must contain at least 6 characters and 1 number
							</span>
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
				</div>
                <Modal
					isOpen={avatarError || coverError}
                    contentLabel="Minimal Modal Example"
                    className="border-0 bg-transparent max-w-lg mx-auto mt-10"
                >
                    <div className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0" style={{marginTop: 150}}>
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
                    <div className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0" style={{marginTop: 150}}>
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
			</PrimaryLayout>
		);
	}
}

export default EditProfile;
