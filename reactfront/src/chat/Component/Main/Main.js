import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Firebase from '../../../firebase';
import images from '../Themes/Images';
import WelcomeBoard from '../WelcomeBoard/WelcomeBoard';
import './Main.css';
import ChatBoard from './../ChatBoard/ChatBoard';
import { AppString } from './../Const';
import 'react-perfect-scrollbar/dist/css/styles.css';
import RSC from 'react-scrollbars-custom';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			isOpenDialogConfirmLogout: false,
			currentPeerUser: null
		};
		this.currentUserId = localStorage.getItem(AppString.ID);
		this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL);
		this.currentUserNickname = localStorage.getItem(AppString.NICKNAME);
		this.listUser = [];
	}

	componentDidMount() {
		this.checkLogin();
	}

	checkLogin = () => {
		if (!localStorage.getItem(AppString.ID)) {
			this.setState({ isLoading: false }, () => {
				this.props.history.push('/chat/join');
			});
		} else {
			this.getListUser();
		}
	};

	getListUser = async () => {
		const result = await Firebase.firestore().collection(AppString.NODE_USERS).get();
		if (result.docs.length > 0) {
			this.listUser = [ ...result.docs ];
			this.setState({ isLoading: false });
		}
	};

	onLogoutClick = () => {
		this.setState({
			isOpenDialogConfirmLogout: true
		});
	};

	doLogout = () => {
		this.setState({ isLoading: true });
		Firebase.auth()
			.signOut()
			.then(() => {
				this.setState({ isLoading: false }, () => {
					localStorage.clear();
					this.props.showToast(1, 'Logout success');
					this.props.history.push('/');
				});
			})
			.catch(function(err) {
				this.setState({ isLoading: false });
				this.props.showToast(0, err.message);
			});
	};

	hideDialogConfirmLogout = () => {
		this.setState({
			isOpenDialogConfirmLogout: false
		});
	};

	onProfileClick = () => {
		this.props.history.push('/profile');
	};

	renderListUser = () => {
		if (this.listUser.length > 0) {
			let viewListUser = [];
			this.listUser.forEach((item, index) => {
				if (item.data().id !== this.currentUserId) {
					viewListUser.push(
						<button
							key={index}
							className={
								this.state.currentPeerUser && this.state.currentPeerUser.id === item.data().id ? (
									'viewWrapItemFocused mb-2'
								) : (
									'viewWrapItem mb-2'
								)
							}
							onClick={() => {
								this.setState({ currentPeerUser: item.data() });
							}}
						>
							<img className="viewAvatarItem" src={item.data().photoUrl} alt="icon avatar" />
							<div className="viewWrapContentItem">
								<span className="textItem">{`${item.data().nickname}`}</span>
							</div>
						</button>
					);
				}
			});
			return viewListUser;
		} else {
			return null;
		}
	};

	render() {
		return (
			<div className="root">
				{/* Body */}
				<div className="body">
					<RSC style={{ height: '90vh', width: '250px', backgroundColor: "#2D3748" }}>
						<div> {this.renderListUser()}</div>
					</RSC>
					<div className="viewBoard">
						{this.state.currentPeerUser ? (
							<ChatBoard currentPeerUser={this.state.currentPeerUser} showToast={this.props.showToast} />
						) : (
							<WelcomeBoard
								currentUserNickname={this.currentUserNickname}
								currentUserAvatar={this.currentUserAvatar}
							/>
						)}
					</div>
				</div>

				{/* Dialog confirm */}
				{this.state.isOpenDialogConfirmLogout ? (
					<div className="viewCoverScreen">{this.renderDialogConfirmLogout()}</div>
				) : null}

				{/* Loading */}
				{this.state.isLoading ? (
					<div className="viewLoading">
						<ReactLoading type={'spin'} color={'#203152'} height={'3%'} width={'3%'} />
					</div>
				) : null}
			</div>
		);
	}

	renderDialogConfirmLogout = () => {
		return (
			<div>
				<div className="viewWrapTextDialogConfirmLogout">
					<span className="titleDialogConfirmLogout">Are you sure to logout?</span>
				</div>
				<div className="viewWrapButtonDialogConfirmLogout">
					<button className="btnYes" onClick={this.doLogout}>
						YES
					</button>
					<button className="btnNo" onClick={this.hideDialogConfirmLogout}>
						CANCEL
					</button>
				</div>
			</div>
		);
	};
}

export default Main;
