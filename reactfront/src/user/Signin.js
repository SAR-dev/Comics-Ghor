import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { signin, authenticate } from '../auth/auth';
import Modal from 'react-modal';
import Welcome from '../images/sky.png';
import LoaderSvg from '../images/rings.svg';
import Img from 'react-image';
import SeoHelmet from '../core/SeoHelmet';

class Signin extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			emailError: true,
			password: '',
			passwordError: true,
			redirectToHome: false,
			loading: false,
			error: '',
			showModal: false
		};
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false });
		this.resetError();
	}

	resetError = () => {
		this.setState({ error: '', loading: false });
	};

	handleEmail = (email) => (event) => {
		var re = /\S+@\S+\.\S+/;
		if (re.test(event.target.value)) {
			this.setState({ emailError: false, email: event.target.value });
		} else {
			this.setState({ emailError: true, email: event.target.value });
		}
	};

	handlePassword = (password) => (event) => {
		var re = /\d/;
		if (event.target.value.length < 6 || !re.test(event.target.value)) {
			this.setState({ passwordError: true, password: event.target.value });
		} else {
			this.setState({ passwordError: false, password: event.target.value });
		}
	};

	clickSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const { email, password } = this.state;
		const user = {
			email,
			password
		};
		signin(user).then((data) => {
			if (data.error) {
				this.setState({ loading: true, error: data.error, showModal: true });
			} else {
				authenticate(data, () => {
					this.setState({ redirectToHome: true });
				});
			}
		});
	};

	render() {
		const { email, emailError, password, passwordError, redirectToHome, loading, error } = this.state;

		if (redirectToHome) {
			return <Redirect to="/" />;
		}

		return (
			<>
			<SeoHelmet title="Sign In" />
			<div className="mx-2">
			<div className="container max-w-md mx-auto xl:max-w-3xl h-full flex bg-gray-700 rounded-lg shadow overflow-hidden md:my-12 my-8">
				<div className="relative hidden xl:block xl:w-1/2 h-full">
					<Img
						className="absolute h-auto w-full object-cover"
						src={Welcome}
						alt="Welcome"
						loader={<img src={LoaderSvg} className="h-auto w-full mx-uto mt-16" />}
					/>
				</div>
				<div className="w-full xl:w-1/2 p-8">
					<form method="post" action="#" onSubmit="return false">
						<h1 className=" text-2xl font-bold text-white">Sign in to your account</h1>
						<div>
							<span className="text-white text-sm">Don't have an account?</span>
							<Link to="/signup" className="text-cream text-sm font-semibold px-1">
								Sign up
							</Link>
						</div>
						<div className="mb-4 mt-6">
							<label className="block text-cream text-sm font-semibold mb-2" htmlfor="email">
								Email
							</label>
							<input
								className="text-sm appearance-none rounded w-full py-2 px-3 text-dark bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
								id="email"
								type="email"
								placeholder="Your email address"
								value={email}
								onChange={this.handleEmail('email')}
								spellCheck="false"
							/>
						</div>
						<div className="mb-6 mt-6">
							<label className="block text-cream text-sm font-semibold mb-2" htmlfor="password">
								Password
							</label>
							<input
								className="text-sm bg-gray-200 appearance-none rounded w-full py-2 px-3 text-dark mb-1 leading-tight focus:outline-none focus:shadow-outline h-10"
								id="password"
								type="password"
								placeholder="Your password"
								value={password}
								onChange={this.handlePassword('password')}
							/>
							<Link
								className="inline-block align-baseline text-sm text-white hover:text-gray-500"
								to="/forgot-password"
							>
								Forgot Password?
							</Link>
						</div>
						<div className="my-2 text-xs tracking-wide">
							<span className={emailError ? 'text-yellow-600 block py-1':'text-blue-500 block py-1'}> <i className={emailError? 'fas fa-times-circle mr-1':'fas fa-check-circle mr-1'}></i> Valid Email</span>
							<span className={passwordError ? 'text-yellow-600 block py-1':'text-blue-500 block py-1'}> <i className={passwordError? 'fas fa-times-circle mr-1':'fas fa-check-circle mr-1'}></i> Password contains 1 number, 6 characters</span>
						</div>
						<div className="flex w-full mt-5">
							{!loading && (
								<button
									className="w-full bg-gray-800 hover:bg-grey-900 text-white text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10"
									onClick={this.clickSubmit}
								>
									Sign in
								</button>
							)}
							{loading && (
								<button className="pointer-events-none w-full bg-gray-800 hover:bg-grey-900 text-white text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10">
									<img src={LoaderSvg} className="h-4 mx-auto" />
								</button>
							)}
						</div>
					</form>
				</div>
				<Modal
					isOpen={this.state.showModal}
					contentLabel="Minimal Modal Example"
					className="border-0 bg-transparent max-w-lg mx-auto mt-10"
				>
					<div
						className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
						style={{ marginTop: 150 }}
					>
						<div className="my-5">
							<h1 className="text-2xl text-white font-semibold pb-5">Sign In Error !</h1>
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
			</div>
			</div>
			</>
		);
	}
}

export default Signin;
