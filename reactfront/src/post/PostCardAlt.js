import React, { Component } from 'react'
import { Link, Redirect } from "react-router-dom";
import { like, unlike } from "./apiPost";
import LazyLoad from 'react-lazyload';
import { isAuthenticated } from '../auth/auth';
import Clap from '../images/clap/clap_bg-none.svg';
import Clapping from '../images/clap/clapping_bg-none.svg';
import Img from 'react-image';
import LoaderSvg from '../images/rings.svg';
import Truncate from 'react-truncate';

export default class PostCard extends Component {
    constructor() {
        super()
        this.state = {
            like: false,
            redirectToSignin: false,
            likes: "",
            loading: false,
            liking: false
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
        this.setState({liking: true})
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true })
            return false;
        }
        this.setState({loading: true})
        let callApi = this.state.like ? unlike : like
        const userId = isAuthenticated().user._id
        const postId = this.props.post._id
        const ownerId = this.props.post.postedBy._id;
        const token = isAuthenticated().token
        callApi(userId, token, postId, ownerId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        like: !this.state.like,
                        liking: false
                    })
                    this.state.like ? this.setState({likes: this.state.likes+1, loading: false}) : this.setState({likes: this.state.likes-1, loading: false})
                }
            })
    };

    render() {
        const {post} = this.props
        if (this.state.redirectToSignin) {
            return <Redirect to={"/signin"} />
        }
        const {like, likes, loading, liking} = this.state

        return (
            <div className="relative rounded shadow-lg border-github p-2 bg-gray-800" style={{height: 360}}>
                {post.thumbnail !== "undefined" && (
                    <div className="overflow-hidden h-48 w-full rounded">
                    <Link to={`/post/${post._id}`} >
                        <LazyLoad offset={100} once>
                            <Img src={`https://i.imgur.com/${post.thumbnail}l.png`} alt="Post" className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-125 rounded-t h-48 w-full object-contain bg-gray-900" loader={<img src={LoaderSvg} className="h-48 mx-auto" />} />
                        </LazyLoad>
                    </Link>
                    </div>
                )}
                <Link to={`/post/${post._id}`}>
                    <h5 className={post.title.length > 30 ? "text-sm m-1 text-white" : "text-lg m-1 text-white"}>
                    <Truncate lines={post.thumbnail === 'undefined' ? 4 : 2} ellipsis={<span>...</span>}>
                        {post.title}
                    </Truncate>
                    </h5>
                {post.summary && (
                <div className="leading-tight mx-1 text-justify" id="summary">
                    <div className={post.thumbnail === 'undefined' ? "text-sm text-white mt-5":"text-xs text-white"}>
                        <Truncate lines={post.thumbnail === 'undefined' ? 12 : 3}>
							{`${post.summary}...`}
						</Truncate>
                    </div>
                </div>
                )}
                </Link>
                <img src={`https://i.imgur.com/${post.postedBy.avatar}s.png`} alt="Avatar" className="h-8 w-8 mt-2 shadow rounded-full object-cover absolute bottom-0 left-0 ml-2 mb-2" />
                <Link to={`/user/${post.postedBy._id}`}>
                    <h6 className="text-xs font-semibold text-white absolute bottom-0 left-0 ml-12 mb-4">{post.postedBy.name}</h6>
                </Link>
                <div className="absolute bottom-0 right-0">
                    <button
                        onClick={liking ? (e) => e.preventDefault() : this.likeToogle}
                        className={
                            like ? (
                                'mr-2 mb-2 relative'
                            ) : (
                                'mr-2 mb-2 relative'
                            )
                        }
                    >
                        {!loading && <Img src={like ? Clapping : Clap} alt="clap" className={like ? "h-8 p-1 mx-auto rounded-full border-yellow-500 border" : "h-8 p-1 mx-auto rounded-full border-gray-400 border"} loader={<img src={LoaderSvg} className="h-8 text-center" />} />}
                        {loading && <img src={LoaderSvg} className="h-8 text-center" />}
                    </button>

                </div>
                    {like ? (
                        <span className="absolute bottom-0 right-0 mb-3 mr-12 text-sm text-yellow-400">
                            {likes < 10 ? `0${likes}` : likes}
                        </span>
                    ) : (
                        <span className="absolute bottom-0 right-0 mb-3 mr-12 text-sm text-gray-500">
                            {likes < 10 ? `0${likes}` : likes}
                        </span>
                    )}
            </div>
        )
    }
}
