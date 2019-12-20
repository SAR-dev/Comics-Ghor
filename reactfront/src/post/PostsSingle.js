import React, { Component } from 'react'
import { Link, Redirect } from "react-router-dom";
import { like, unlike } from "./apiPost";
import Truncate from 'react-truncate';
import sanitizeHtml from 'sanitize-html-react';
import LazyLoad from 'react-lazyload';
import { isAuthenticated } from '../auth/auth';

export default class PostsSingle extends Component {
    constructor() {
        super()
        this.state = {
            like: false,
            redirectToSignin: false,
            likes: ""
        }

    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.setState({
            like: this.checkLike(this.props.post.likes),
            likes: this.props.post.likes.length
        })
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id
        let match = likes.indexOf(userId) !== -1
        return match
    };

    getFirstImage = (images) => {
        if (images) {
            const imageFirst = images.split(",")
            return imageFirst[0]
        } else {
            return false
        }
    }

    likeToogle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true })
            return false;
        }
        let callApi = this.state.like ? unlike : like
        const userId = isAuthenticated().user._id
        const postId = this.props.post._id
        const token = isAuthenticated().token
        callApi(userId, token, postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        like: !this.state.like,
                    })
                    this.state.like ? this.setState({likes: this.state.likes+1}) : this.setState({likes: this.state.likes-1})
                }
            })
    };

    render() {
        const {post} = this.props
        const postSeriesof = post.seriesOf ? post.seriesOf.name : ""
        if (this.state.redirectToSignin) {
            return <Redirect to={"/signin"} />
        }

        return (
            <div className="card-body bg-light">
                <div className="row">
                    <div className={post.image.length > 0 ? "col-md-7 col-sm-12 pt-2" : "col-md-12 col-sm-12 pt-2"}>
                        <span className="card-series">{postSeriesof}</span>
                        <Link
                            to={`/post/${post._id}`}
                            className="text-decoration-none"
                        >
                            <h5 className="card-title lead">{post.title}</h5>
                            <Truncate className="card-text" lines={6} ellipsis={<span className="text-info">....Read more</span>}>
                                {sanitizeHtml(post.body, {
                                    allowedTags: [],
                                    allowedAttributes: []
                                })}
                            </Truncate>
                        </Link>
                    </div>
                    <div className="col-md-5 col-sm-12">
                        <div className="d-block w-100 text-center card-image">
                            {post.image[0] && (
                                <LazyLoad offset={100}>
                                    <img src={`https://i.imgur.com/${this.getFirstImage(post.image[0])}m.png`} />
                                </LazyLoad>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row card-user mt-2">
                    <div className="col-7">
                        <div className="card-avatar float-left">
                            <img src={`https://i.imgur.com/${post.postedBy.avatar}s.png`} />
                        </div>
                        <div className="card-user-link">
                            <Link to={`/user/${post.postedBy._id}`}>
                                <span className="card-username d-block">{post.postedBy.name}</span>
                                <span className="card-date d-block">{new Date(post.created).toDateString()}</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-5 text-center">
                        <button onClick={this.likeToogle} className="mt-1 d-inline btn btn-small px-5 btn-light bg-light btn-block like">
                            <i className={this.state.like ? "fas fa-heart" : "far fa-heart"}></i>
                            <span className="likes-counter">{this.state.likes}</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
