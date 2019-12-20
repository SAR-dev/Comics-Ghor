import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { Redirect } from 'react-router-dom';
import { read } from './apiUser';
// import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost';
import './Profile.css';

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: "",
            posts: []
        }
    };

    checkFollow = (user) => {
        const jwtC = isAuthenticated()
        const match = user.followers.find(follower => {
            return follower._id === jwtC.user._id
        })
        return match
    };

    clickFollow = (callApi) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    this.setState({ user: data, following: !this.state.following })
                }
            })
    };

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true })
                } else {
                    let following = this.checkFollow(data)
                    this.setState({ user: data, following })
                    this.loadPosts(data._id)
                }
            })
    };

    loadPosts = (userId) => {
        const token = isAuthenticated().token
        listByUser(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ posts: data })
                }
            })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId);
    };

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId
        this.init(userId);
    };

    render() {
        const { redirectToSignin, user, posts } = this.state
        if (redirectToSignin) {
            return <Redirect to="/signin" />
        }

        return (
            <div className="container px-0">
                <div className="row">
                    <div className="col-lg-6 col-12 bg-white full-screen">
                        <div className="row cover-photo">
                            <img src={`https://i.imgur.com/${user.cover}h.png`} />
                        </div>
                        {isAuthenticated().user && isAuthenticated().user._id === user._id && (
                            <div className="row profile-edit-del">
                                <button className="btn edit mx-1" onClick={() => this.props.history.push(`/user/edit/${user._id}`)}>
                                    Edit
                            </button>
                                {/* <DeleteUser userId={user._id} /> */}
                            </div>
                        )}
                        <div className="row profile-photo">
                            <img src={`https://i.imgur.com/${user.avatar}m.png`} />
                            <div className="profile-footer">
                                <p className="username text-primary">{user.name}</p>
                                <p className="email text-muted">
                                    <i className="material-icons">email</i>
                                    <span>{user.email}</span>
                                </p>
                                <p className="joined text-muted">
                                    <i className="material-icons">add_circle</i>
                                    <span>{`Joined ${new Date(user.created).getFullYear()}`}</span>
                                </p>
                                <div className="row px-3 my-2">
                                    <div className="d-inline follow-count mr-2">{user.followers.length} Followers</div>
                                    <div className="d-inline follow-count">{user.following.length} Followings</div>
                                </div>
                                {isAuthenticated().user && isAuthenticated().user._id === user._id ? "" : (
                                    <FollowProfileButton
                                        following={this.state.following}
                                        onButtonClick={this.clickFollow}
                                    />
                                )}
                            </div>
                        </div>
                        {user.about && (
                            <div className="about-yourself mx-3 my-4">
                                <h6 className="text-primary"><i className="fas fa-theater-masks mr-2 text-primary"></i>ABOUT ME</h6>
                                <p className="text-muted pre-line">{user.about}</p>
                            </div>
                        )}
                        <div className="d-flex my-2 mx-3 social-icons justify-content-start">
                            {user.Sinstagram && (<a className="text-primary mr-3" href={`${user.Sinstagram}`} target="_blank"><i className="fab fa-instagram"></i></a>)}
                            {user.Sfacebook && (<a className="text-primary mr-3" href={`${user.Sfacebook}`} target="_blank"><i className="fab fa-facebook"></i></a>)}
                            {user.Stwitter && (<a className="text-primary mr-3" href={`${user.Stwitter}`} target="_blank"><i className="fab fa-twitter"></i></a>)}
                            {user.Syoutube && (<a className="text-primary mr-3" href={`${user.Syoutube}`} target="_blank"><i className="fab fa-youtube"></i></a>)}
                        </div>
                    </div>
                    <div className="col-lg-6 col-12">
                        <ProfileTabs
                            followers={user.followers}
                            following={user.following}
                            user={user}
                            posts={posts}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
export default Profile;