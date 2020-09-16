import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';
import { clearComment } from './apiNotification';
import LoaderSvg from '../images/rings.svg';

export default class CommentNotification extends Component {
    constructor(){
        super()
        this.state = {
            exists: true,
            loading: false
        }
    }

    remove = () => {
        this.setState({loading: true})
        const ownerId = isAuthenticated().user._id
        const postId = this.props.data.post._id
        const userId = this.props.data.user._id
        const token = isAuthenticated().token
        clearComment(userId, token, postId, ownerId).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ exists: false });
            }
        });
    }

    render() {
        const {user, post} = this.props.data
        return (
            <>
            {this.state.exists && (
            <div className="w-full flex my-1 rounded bg-gray-900 text-xs text-white relative" >
                {this.state.loading && (
                    <img src={LoaderSvg} className="h-10 my-2 mx-auto" />
                )}
                {!this.state.loading && (
                    <>
                        <div className="flex-initial">
                        <Link to={`/post/${post._id}`} className="block p-2">
                            <span>{user.name}</span> Commented on your post <span>{post.title.length > 50 ? `${post.title.slice(0,50)}...` : post.title}</span>
                        </Link>
                        </div>
                        <div className="flex bg-gray-700 cursor-pointer rounded-r" onClick={this.remove}>
                            <div className="my-auto">
                            <span className="text-xs">
                                <i className="fas fa-trash-alt px-1"></i>
                            </span>
                        </div>
                        </div>
                    </>
                )}
            </div>
            )}
            </>
        )
    }
}
