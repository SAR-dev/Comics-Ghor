import React, { Component } from 'react';
import { singlePost, remove, like, unlike } from './apiPost';
import LazyLoad from 'react-lazyload';
import { Link, Redirect } from "react-router-dom";
import uploading from '../images/uploading.gif';
import { isAuthenticated } from '../auth/auth';
import Comment from './Comment';
import './SinglePost.css';

class SinglePost extends Component {
    constructor() {
        super()
        this.state = {
            _id: "",
            title: "",
            body: "",
            created: "",
            image: [],
            postedBy: {},
            seriesName: "",
            loading: true,
            redirectToHome: false,
            redirectToSignin: false,
            check: false,
            likes: "",
            like: false,
            comments: []
        }
    };

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id
        let match = likes.indexOf(userId) !== -1
        return match
    };

    likeToogle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true })
            return false;
        }
        let callApi = this.state.like ? unlike : like
        const userId = isAuthenticated().user._id
        const postId = this.state._id
        const token = isAuthenticated().token
        callApi(userId, token, postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        like: !this.state.like,
                        likes: data.likes
                    })
                }
            })
    };

    componentDidMount() {
        const postId = this.props.match.params.postId
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    console.log(data.comments)
                    const image = data.image[0] ? data.image[0].split(',') : undefined
                    this.setState({
                        _id: data._id,
                        title: data.title,
                        body: data.body,
                        created: data.created,
                        image: image,
                        postedBy: data.postedBy,
                        seriesName: data.seriesOf.name,
                        loading: false,
                        likes: data.likes,
                        like: this.checkLike(data.likes),
                        comments: data.comments
                    })
                }
            })
    }

    checkDeletePost = () => {
        this.setState({ check: true })
    }

    cancelDeletePost = () => {
        this.setState({ check: false })
    }

    deletePost = () => {
        const postId = this.props.match.params.postId
        const token = isAuthenticated().token
        remove(postId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ redirectToHome: true })
                }
            })
    }

    createMarkup = () => {
        return { __html: this.state.body };
    }

    updateComments = (comments) => {
        this.setState({comments})
    }

    render() {
        const { title, body, created, image, postedBy, seriesName, loading, check, _id, likes, like, comments } = this.state
        if (this.state.redirectToHome) {
            return <Redirect to={"/"} />
        } else if (this.state.redirectToSignin) {
            return <Redirect to={"/signin"} />
        }
        return (
            <>
                <div className="container" id="SINGLEPOST">
                    <div className="row my-5">
                        <div className="post-card col-lg-8 col-sm-12 single-post-div">
                            <div className="card-body">
                                <span className="card-series">{seriesName}</span>
                                {isAuthenticated().user && isAuthenticated().user._id === postedBy._id && <>
                                    <div className="float-right">
                                        <Link style={{ fontSize: "10px" }} className="btn btn-sm text-muted mx-1" to={`/post/edit/${_id}`}>Update</Link>
                                        <button onClick={this.checkDeletePost} style={{ fontSize: "10px" }} className="btn btn-sm text-muted mx-1">Delete</button>
                                    </div>
                                </>}
                                <h4 className="card-title text-center py-3 my-3 border-top border-bottom" style={{ fontSize: "40px" }}>{title}</h4>
                                <div className="card-text" dangerouslySetInnerHTML={this.createMarkup()} />
                                
                                <div className="text-center">
                                {image && image.map((imgSrc, i) => (
                                    <LazyLoad offset={100} key={i}>
                                        <img className="my-2 rounded" src={`https://i.imgur.com/${imgSrc}l.png`} style={{ width: "100%" }} />
                                    </LazyLoad>
                                ))}
                                </div>
                                
                                <div className="row like my-2 mx-0">
                                    <div className="col-6 px-1">
                                        <button onClick={this.likeToogle} className="btn btn-sm btn-block btn-light">
                                            <i className={like ? "fas fa-heart" : "far fa-heart"}></i>
                                        </button>
                                    </div>
                                    <div className="col-6 px-1">
                                        <button className="btn btn-sm btn-block btn-light text-muted" style={{paddingTop: "9px", paddingBottom: "9px"}}>{likes.length} People Loved</button>
                                    </div>
                                </div>

                                <div className="row mx-0 card-user">
                                    <div className="card-avatar"><img src={`https://i.imgur.com/${postedBy.avatar}s.png`} /></div>
                                    <Link className="card-user-link" to={`/user/${postedBy._id}`}>
                                        <span className="card-username">{postedBy.name}</span>
                                        <br />
                                        <span className="card-date mt-0">Posted on {new Date(created).toDateString()}</span>
                                    </Link>
                                    <div className="member-since">
                                        Member Since {new Date(postedBy.created).getFullYear()}
                                    </div>
                                </div>
                                
                            </div>

                            <div className="row">
                                <Comment postId= {_id} comments={comments.reverse()} updateComments={this.updateComments} />
                            </div>
                        </div>
                        <div className="col-lg-4 d-sm-none d-lg-block promotions-list">
                            <div className="row">
                                <div className="col-12 pronotions">
                                    <div className="rounded m-4" style={{background: "#d7e3da", height: "250px"}}>
                                        <div className="text-center" style={{fontSize: "25px", fontWeight: "300", color: "white", paddingTop: "100px"}}>PROMOTED CONTENT</div>
                                    </div>
                                </div>
                                <div className="col-12 pronotions">
                                    <div className="rounded m-4" style={{background: "#d7e3da", height: "250px"}}>
                                        <div className="text-center" style={{fontSize: "25px", fontWeight: "300", color: "white", paddingTop: "100px"}}>PROMOTED CONTENT</div>
                                    </div>
                                </div>
                                <div className="col-12 pronotions">
                                    <div className="rounded m-4" style={{background: "#d7e3da", height: "250px"}}>
                                        <div className="text-center" style={{fontSize: "25px", fontWeight: "300", color: "white", paddingTop: "100px"}}>PROMOTED CONTENT</div>
                                    </div>
                                </div>
                                <div className="col-12 pronotions">
                                    <div className="rounded m-4" style={{background: "#d7e3da", height: "250px"}}>
                                        <div className="text-center" style={{fontSize: "25px", fontWeight: "300", color: "white", paddingTop: "100px"}}>PROMOTED CONTENT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={loading ? "loading-state modal fade show d-block blurred" : "modal fade"} tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{border: "1px solid whitesmoke"}}>
                            <div className="modal-body" style={{ background: "white", border: "none", textAlign: "center" }}>
                                <img src={uploading} style={{ height: "150px" }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={check ? "loading-state modal fade show d-block blurred" : "modal fade"} tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{ background: "white", border: "1px solid #ccc", textAlign: "center",  }}>
                            <div className="modal-body py-5">
                                <h4 className="font-weight-normal">Do you really want to delete this post?</h4>
                            </div>
                            <div className="modal-footer justify-content-around">
                                <button onClick={this.deletePost} className="btn btn-outline-danger btn-sm">Yes, I am sure</button>
                                <button onClick={this.cancelDeletePost} className="btn btn-outline-primary btn-sm">No, go back</button>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default SinglePost;