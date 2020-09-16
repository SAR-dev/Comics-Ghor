import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Firebase from '../../../firebase';
import { AppString } from './../Const';
import {isAuthenticated} from '../../../auth/auth';
import { Redirect } from 'react-router-dom';

class ChatProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: localStorage.getItem(AppString.ID),
			nickname: localStorage.getItem(AppString.NICKNAME),
			aboutMe: localStorage.getItem(AppString.ABOUT_ME),
			photoUrl: localStorage.getItem(AppString.PHOTO_URL)
		};
		this.newAvatar = null;
		this.newPhotoUrl = '';
	}

	componentDidMount() {
		this.checkLogin();
    }
    
    updateAvatar = () => {
        this.setState({photoUrl: `https://i.imgur.com/${isAuthenticated().user.avatar}m.png`})
    }

	checkLogin = () => {
		if (!localStorage.getItem(AppString.ID)) {
			this.props.history.push('/');
		}
	};

	updateUserInfo = (isUpdatePhotoUrl, downloadURL) => {
		let newInfo;
		newInfo = {
            photoUrl: this.state.photoUrl
        };
		Firebase.firestore().collection(AppString.NODE_USERS).doc(this.state.id).update(newInfo).then((data) => {
            localStorage.setItem(AppString.PHOTO_URL, this.state.photoUrl);
            this.props.history.push('/chat/message');
		});
	};

	render() {
		return (
            <div className="container mx-auto text-center flex flex-wrap">
                <div className="mb-5 mt-20 w-full">
                    <img src={this.state.photoUrl} className="rounded-full h-32 w-32 object-cover mx-auto" />
                </div>
                <div className="w-full">
                <button onClick={this.updateAvatar} className="mx-auto text-white my-2 bg-gray-800 hover:bg-gray-700 px-5 py-3 cursor-pointer rounded shadow">
                    Update Avatar
                </button>
                </div>
                <div className="w-full">
                <button onClick={this.updateUserInfo} className="mx-auto text-white my-2 bg-gray-800 hover:bg-gray-700 px-5 py-3 cursor-pointer rounded shadow">
                    Submit
                </button>
                </div>
            </div>
			
        )
        }
}

export default ChatProfile;
