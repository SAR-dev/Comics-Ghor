import React, { Component } from "react";
import { list } from "./apiPost";
import PostSingle from './PostsSingle';
import './Posts.css';

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            check: false,
            likes: "",
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    }

    render() {
        const { posts } = this.state;
        return (
            <div id="POSTS">
                <div className="row rounded box-shadow pb-5">
                    <span className="d-block text-secondary fs-small-header pl-4 pt-4">RECENT POSTS</span>
                    {posts.map((post, i) => (
                        <div className="post-card col-12" key={i}>
                            <PostSingle post={post} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Posts;