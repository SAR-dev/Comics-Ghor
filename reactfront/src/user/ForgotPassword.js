import React, { Component } from 'react';
import { forgotPassword } from '../auth';
import PrimaryLayout from '../core/PrimaryLayout';
import { Link } from 'react-router-dom';

class ForgotPassword extends Component {
	state = {
		email: '',
		message: '',
		error: ''
	};

	forgotPassword = (e) => {
		e.preventDefault();
		this.setState({ message: '', error: '' });
		forgotPassword(this.state.email).then((data) => {
			if (data.error) {
				console.log(data.error);
				this.setState({ error: data.error });
			} else {
				console.log(data.message);
				this.setState({ message: data.message, email: '' });
			}
		});
	};

	render() {
		return (
			<PrimaryLayout>
				<div className="container mx-auto">
					{!this.state.message && !this.state.error && <div className="block" style={{ height: 68 }} />}
					{this.state.message && (
						<div className="text-center py-4 lg:px-4">
							<div
								className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
								role="alert"
							>
								<span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
									Message
								</span>
								<span className="font-semibold mr-2 text-left flex-auto">{this.state.message}</span>
								<svg
									className="fill-current opacity-75 h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
								</svg>
							</div>
						</div>
					)}
					{this.state.error && (
						<div className="text-center py-4 lg:px-4">
							<div
								className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
								role="alert"
							>
								<span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
									Error
								</span>
								<span className="font-semibold mr-2 text-left flex-auto">{this.state.error}</span>
								<svg
									className="fill-current opacity-75 h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
								</svg>
							</div>
						</div>
					)}
					<div className="flex justify-center px-6 mb-5">
						<div className="w-full xl:w-3/4 lg:w-11/12 flex rounded-lg shadow">
							<div
								className="w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
								style={{ backgroundImage: 'url("https://i1.lensdump.com/i/jRgk77.png")' }}
							/>
							<div className="w-full lg:w-1/2 bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
								<div className="px-8 mb-4 text-center">
									<h3 className="pt-4 mb-2 text-2xl font-semibold text-white">Forgot Your Password?</h3>
									<p className="mb-4 text-sm text-cream">
										We get it, stuff happens. Just enter your email address below and we'll send you
										a link to reset your password!
									</p>
								</div>
								<form className="px-8 pt-6 pb-8 mb-4 rounded">
									<div className="mb-4">
										<label className="block mb-2 text-sm font-bold text-cream" htmlFor="email">
											Email
										</label>
										<input
											className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
											id="email"
											type="email"
											placeholder="Enter Email Address..."
											spellCheck="false"
											value={this.state.email}
											onChange={(e) =>
												this.setState({
													email: e.target.value,
													message: '',
													error: ''
												})}
										/>
									</div>
									<div className="mb-6 text-center">
										<button
											className="w-full px-4 py-2 font-bold text-white bg-gray-800 rounded-full"
											type="button"
											onClick={this.forgotPassword}
										>
											Reset Password
										</button>
									</div>
									<hr className="mb-6 border-t" />
									<div className="text-center">
										<Link
											className="inline-block text-sm text-cream align-baseline hover:text-blue-500"
											to="/signup"
										>
											Create an Account!
										</Link>
									</div>
									<div className="text-center">
										<Link
											className="inline-block text-sm text-cream align-baseline hover:text-blue-500"
											to="/signin"
										>
											Already have an account? Login!
										</Link>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</PrimaryLayout>
		);
	}
}

export default ForgotPassword;
