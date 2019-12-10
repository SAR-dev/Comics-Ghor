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
                <div className="row bg-light rounded box-shadow">
                    <span className="d-block rounded-top text-secondary w-100 fs-small-header pl-4 pt-4">RECENT POSTS</span>
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