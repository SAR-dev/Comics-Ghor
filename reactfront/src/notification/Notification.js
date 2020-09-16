import React, { Component } from 'react'
import { slide as Menu } from 'react-burger-menu';
import { notification } from './apiNotification';
import { isAuthenticated } from '../auth/auth';
import LikeNotification from './LikeNotification';
import CommentNotification from './CommentNotification'
import RSC from "react-scrollbars-custom";

class Notification extends Component {
    constructor() {
		super();
		this.state = {
			like: [],
			comment: []
		};
    }
    
    componentDidMount() {
        this.getData();
        setInterval(this.getData, 20000); // runs every 20 seconds.
      }


    getData = () => {
        if (isAuthenticated()){
            const token = isAuthenticated().token;
            const userId = isAuthenticated().user._id
            notification(userId, token).then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ like: data.likeNot, comment: data.commentNot });
                }
            });
        }
    }
    
    render() {
        const { like, comment } = this.state
        return (
            <Menu customBurgerIcon={ <i className={like.length ===0 && comment.length === 0 ? "text-white bg-yellow-500 p-2 rounded-full fas fa-bell opacity-25 notification-icon" : "notification-icon text-white bg-yellow-500 p-2 rounded-full fas fa-bell" }></i> } >
            <RSC id="notification-scroll">
            <div className="flex flex-wrap my-10 mx-2">
                <h1 className="w-full text-yellow-500 uppercase font-semibold text-xl text-center my-5">Notifications</h1>
                {comment.map((data, i) => {
                    return (
                        <CommentNotification data={data} key={i} />
                    )
                })}
                {like.map((data, i) => {
                    return (
                        <LikeNotification data={data} key={i} />
                    )
                })}
            </div>
            </RSC>
            </Menu>
        )
    }
}

export default Notification;