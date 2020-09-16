import React, { Component } from 'react';
import md5 from 'md5';
import { isAuthenticated } from '../auth/auth';
import Firebase from '../firebase';
import LoadingModal from '../core/LoadingModal';
import Modal from 'react-modal';
import { Redirect } from 'react-router-dom';

export default class Join extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			avatar: '',
			password: '',
			message: '',
			loading: false,
			redirectToMessage: false
		};
	}

	handleCloseModal = () => {
		this.setState({ message: '', loading: true });
		this.signin()
	}

	componentDidMount() {
		if (isAuthenticated()) {
			this.setState({
				name: isAuthenticated().user.name,
				email: isAuthenticated().user.email,
				avatar: `https://i.imgur.com/${isAuthenticated().user.avatar}s.png`,
				password: md5(
					`${isAuthenticated().user.email}${process.env.REACT_APP_SECRET_KEY}${isAuthenticated().user._id}`
				)
			});
		}
	}

	signup = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		Firebase
			.auth()
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(() => {
                this.setState({message: 'Subscription successfully completed !', loading: false})
			})
			.catch((err) => {
				if (err.code === 'auth/email-already-in-use') {
					this.signin();
				} else {
					this.setState({
						error: this.state.error.concat(err),
						loading: false
					});
				}
			});
	};

	signin = () => {
		Firebase
			.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then(async (result) => {
                let user = result.user;
				if (user) {
                    const result = await Firebase
                        .firestore()
						.collection('users')
						.where('id', '==', user.uid)
                        .get();
					if (result.docs.length === 0) {
                        Firebase
                            .firestore()
							.collection('users')
							.doc(user.uid)
							.set({
								id: user.uid,
								nickname: isAuthenticated().user.name,
								photoUrl: `https://i.imgur.com/${isAuthenticated().user.avatar}l.png`
							})
							.then((data) => {
								localStorage.setItem('id', user.uid);
								localStorage.setItem('nickname', isAuthenticated().user.name);
								localStorage.setItem('photoUrl', `https://i.imgur.com/${isAuthenticated().user.avatar}l.png`);
								this.setState({redirectToMessage: true})
							});
					} else {
						localStorage.setItem('id', result.docs[0].data().id);
						localStorage.setItem('nickname', result.docs[0].data().nickname);
						localStorage.setItem('photoUrl', result.docs[0].data().photoUrl);
						this.setState({redirectToMessage: true})
					}
				} else {
					this.setState({loading: false, redirectToMessage: true})
				}
			})
			.catch((err) => {
                console.log(err)
                this.setState({loading: false})
			});
	};

	saveUser = (createdUser) => {
		return this.state.usersRef.child(createdUser.user.uid).set({
			name: createdUser.user.displayName,
			avatar: createdUser.user.photoURL
		});
	};

	render() {
		const { name, loading, message, redirectToMessage } = this.state;

		if (redirectToMessage) {
			return <Redirect to={'/chat/message'} />;

		}
		return (
			<div>
				<div className="max-w-screen-lg mx-auto flex flex-wrap" style={{ height: '80vh' }}>
					<div className="m-auto px-16 py-10 bg-gray-800 rounded">
						<h1 className="text-center tracking-wide my-2 text-white text-2xl font-semibold">{`Welcome ${name}`}</h1>
						<h1 className="text-center my-2 text-white text-lg">Click Continue to start messaging</h1>
						<div className="flex text-center mt-4">
							<button
								onClick={this.signup}
								className="px-5 py-2 uppercase bg-gray-900 text-lg text-white mx-auto shadow rounded hover:bg-gray-700"
							>
								CONTINUE
							</button>
						</div>
					</div>
				</div>
				<LoadingModal trigger={loading} text="LOADING..." />
				<Modal
					isOpen={message.length > 0}
					contentLabel="Minimal Modal Example"
					className="border-0 bg-transparent max-w-lg mx-auto mt-10"
				>
					<div
						className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
						style={{ marginTop: 150 }}
					>
						<div className="my-5">
							<h1 className="text-2xl text-white font-semibold pb-5">Success !</h1>
							<p className="text-sm text-white">{`${message}`}</p>
						</div>
						<div className="mt-10 mb-5">
							<button
								className="px-3 py-2 rounded bg-white font-semibold"
								onClick={this.handleCloseModal}
							>
								Continue
							</button>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}
