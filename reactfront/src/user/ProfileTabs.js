import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { findPeople, follow } from './apiUser';
import { isAuthenticated } from '../auth/auth';
import LazyLoad from 'react-lazyload';

class ProfileTabs extends Component {
    constructor() {
        super()
        this.state = {
            active: 1,
            users: [],
            error: "",
            open: false,
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        findPeople(userId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data })
            }
        })
    };

    switchToFollower = (i) => {
        this.setState({ active: 1 })
    }
    switchToFollowing = (i) => {
        this.setState({ active: 2 })
    }
    switchToPosts = (i) => {
        this.setState({ active: 3 })
    }
    switchToWhotofollow = (i) => {
        this.setState({ active: 4 })
    }

    getFirstImage = (images) => {
        if (images) {
            const imageFirst = images.split(",")
            return imageFirst[0]
        } else {
            return false
        }
    }

    clickFollow = (person, i) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        follow(userId, token, person._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    let toFollow = this.state.users
                    toFollow.splice(i, 1)
                    this.setState({
                        users: toFollow,
                        open: true,
                    })
                }
            })
    }

    render() {
        const { following, followers, user, posts } = this.props
        const { active, users } = this.state
        return (
            <div className="container">
                <div className="row my-5 profile-btn-list justify-content-around">
                    <button className={active === 1 ? "btn btn-sm active" : "btn btn-sm"} onClick={this.switchToFollower}>Followers</button>
                    <button className={active === 2 ? "btn btn-sm active" : "btn btn-sm"} onClick={this.switchToFollowing}>Following</button>
                    {isAuthenticated().user && isAuthenticated().user._id === user._id && (
                        <button className={active === 4 ? "btn btn-sm active" : "btn btn-sm"} onClick={this.switchToWhotofollow}>Who to Follow</button>
                    )}
                    <button className={active === 3 ? "btn btn-sm active" : "btn btn-sm"} onClick={this.switchToPosts}>Posts</button>
                </div>

                {this.state.active === 1 && (
                    <div className="row">
                        {followers.map((person, i) => (
                            <div className="col-6 my-2 py-1" key={i}>
                                <div className="follow-details">

                                    <div className="row">
                                        <div className="col-12">
                                            <Link to={`/user/${person._id}`} style={{ textDecoration: "none" }}>
                                                <div className="row">
                                                    <div className="follow-avatar">
                                                        <img className="my-2" src={`https://i.imgur.com/${person.avatar}s.png`} />
                                                    </div>
                                                    <div className="follow-name">
                                                        <span className="text-muted font-weight-bold">{person.name}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                        )}
                    </div>
                )}

                {this.state.active === 2 && (
                    <div className="row">
                        {following.map((person, i) => (
                            <div className="col-6 my-2 py-1" key={i}>
                                <div className="follow-details">

                                    <div className="row">
                                        <div className="col-12">
                                            <Link to={`/user/${person._id}`} style={{ textDecoration: "none" }}>
                                                <div className="row">
                                                    <div className="follow-avatar">
                                                        <img className="my-2" src={`https://i.imgur.com/${person.avatar}s.png`} />
                                                    </div>
                                                    <div className="follow-name">
                                                        <span className="text-muted font-weight-bold">{person.name}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                        )}
                    </div>
                )}

                {this.state.active === 3 && (
                    <div className="row">
                        {posts.map((post, i) => (
                            <Link to={`/post/${post._id}`} className="text-decoration-none text-muted col-12 mb-3" style={{ padding: "15px", background: "white", border: "1px solid #ccc", borderRadius: "10px", width: "100%" }} key={i}>
                                <div>
                                    <h5 className="lead">{post.title}</h5>
                                </div>
                                <div className="text-center">
                                    {post.image[0] && (
                                        <LazyLoad offset={100}>
                                            <img className="mt-2" src={`https://i.imgur.com/${this.getFirstImage(post.image[0])}m.png`} style={{borderRadius: "5px", height: "200px", objectFit: "cover"}} />
                                        </LazyLoad>
                                    )}
                                </div>
                                <span className="mt-1" style={{fontSize: "12px"}}>Posted on {new Date(post.created).toDateString()}</span>
                            </Link>
                        )
                        )}
                    </div>
                )}

                {this.state.active === 4 && (
                    <div className="row">
                        {users.map((person, i) => (
                            <div className="col-12 my-2 py-1" key={i}>
                                <div className="follow-details">

                                    <div className="row">
                                        <div className="col-9">
                                            <Link to={`/user/${person._id}`} onClick={this.switchToFollower} style={{ textDecoration: "none" }}>
                                                <div className="row">
                                                    <div className="follow-avatar">
                                                        <img className="my-2" src={`https://i.imgur.com/${person.avatar}s.png`} />
                                                    </div>
                                                    <div className="follow-name">
                                                        <span className="text-muted font-weight-bold">{person.name}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-3">
                                            <button
                                                onClick={() => this.clickFollow(person, i)}
                                                className="btn btn-sm btn-primary px-3"
                                                style={{ marginTop: "18px", borderRadius: "15px" }}
                                            >
                                                Follow
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                        )}
                    </div>
                )}

            </div>
        )
    }
}

export default ProfileTabs;