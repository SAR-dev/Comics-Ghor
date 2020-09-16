import React from 'react';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import Modal from 'react-modal';
import SeoHelmet from '../core/SeoHelmet';

class Help extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '', email: '', message: '', mobile: '', success: false };
	}

	handleForm = (e) => {
		axios
			.post('https://formcarry.com/s/8NjJCooFZ6TL', this.state, { headers: { Accept: 'application/json' } })
			.then(function(response) {
				// access response.data in order to check formcarry response
				if (response.data.success) {
					
				} else {
					console.log(response.data.message);
				}
			})
			.catch(function(error) {
				console.log(error);
            });
            this.setState({ success: true });
		e.preventDefault();
	};

	handleFields = (e) => this.setState({ [e.target.name]: e.target.value });

	render() {
		return (
            <>
            <SeoHelmet title="Help" />
			<div className="mx-auto max-w-screen-sm">
				{!this.state.success && (
					<form onSubmit={this.handleForm} className="mx-2 p-6 my-16 bg-gray-800 text-white rounded">
						<h1 className="text-center text-gray-500 text-xl mb-6 font-semibold tracking-widest">
							ASK ANYTHING
						</h1>
						<div class="flex flex-wrap -mx-3 mb-3">
							<div class="w-full px-3 mb-6">
								<input
									type="text"
									id="name"
                                    name="name"
                                    value={this.state.name}
									onChange={this.handleFields}
									class="bg-gray-900 appearance-none border border-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-gray-500"
									placeholder="Name"
									style={{ transition: 'all 0.15s ease 0s' }}
									spellCheck="false"
									autoComplete="new-password"
								/>
							</div>

							<div class="w-full px-3 mb-6">
								<input
									type="email"
									id="email"
                                    name="email"
                                    value={this.state.email}
									onChange={this.handleFields}
									class="bg-gray-900 appearance-none border border-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-gray-500"
									placeholder="Email"
									style={{ transition: 'all 0.15s ease 0s' }}
									spellCheck="false"
									autoComplete="new-password"
								/>
							</div>

							<div class="w-full px-3 mb-6">
								<input
									type="text"
									id="mobile"
                                    name="mobile"
                                    value={this.state.mobile}
									onChange={this.handleFields}
									class="bg-gray-900 appearance-none border border-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-gray-500"
									placeholder="Contact No"
									style={{ transition: 'all 0.15s ease 0s' }}
									spellCheck="false"
									autoComplete="new-password"
								/>
							</div>

							<div className="w-full px-3 mb-6">
								<TextareaAutosize
									placeholder="Feel free to write or ask anything ..."
									type="text"
									name="message"
									id="message"
									className="h-32 resize-y bg-gray-900 appearance-none border border-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-gray-500"
                                    value={this.state.message}
                                    onChange={this.handleFields}
									minRows="5"
									style={{ transition: 'all 0.15s ease 0s' }}
								/>
							</div>
						</div>
						<button
							type="submit"
							className={!this.state.name || !this.state.email || !this.state.mobile || !this.state.message ? "px-4 py-2 tracking-wide border border-gray-700 hover:bg-gray-700 text-gray-500 bg-gray-900 rounded pointer-events-none" : "px-4 py-2 tracking-wide border border-gray-700 hover:bg-gray-700 text-white bg-gray-900 rounded"}
							style={{ transition: 'all 0.15s ease 0s' }}
						>
							Send
						</button>
						<p className={!this.state.name || !this.state.email || !this.state.mobile || !this.state.message ? "text-xs text-gray-500 mt-4 tracking-wide" : "text-xs text-gray-500 mt-4 opacity-0 tracking-wide"}>*** Please fill in all the fields</p>
					</form>
				)}
                <Modal
                    isOpen={this.state.success}
                    contentLabel="Minimal Modal Example"
                    className="border-0 bg-transparent max-w-lg mx-auto mt-10"
                >
                    <div
                        className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
                        style={{ marginTop: 150 }}
                    >
                        <div className="my-5">
                            <h1 className="text-2xl text-white font-semibold pb-5">Thanks !</h1>
                            <p className="text-sm text-white">We got your mail. We will contact you soon.</p>
                        </div>
                        <div className="mt-10 mb-5">
                            <button
                                className="px-3 py-2 rounded bg-white font-semibold"
                                onClick={() => this.setState({ name: '', email: '', message: '', mobile: '', success: false })}
                            >
                                GOT IT
                            </button>
                        </div>
                    </div>
                </Modal>
			</div>
            </>
		);
	}
}

export default Help;
