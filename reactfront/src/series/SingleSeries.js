import React, { Component } from 'react';
import { seriesDataById } from './apiSeries';
import SeriesData from './SeriesData';
import { Link } from "react-router-dom";
import './SingleSeries.css';

export default class SingleSeries extends Component {
    constructor() {
        super()
        this.state = {
            posts: [],
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        const seriesId = this.props.match.params.seriesId
        seriesDataById(seriesId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ posts: data })
                }
            })
    }
    render() {
        const seriesDataId = this.props.match.params.seriesId
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <SeriesData seriesDataId={seriesDataId} />
                    </div>
                    <div className="col-lg-8 col-12 mx-auto chapter-header">
                        <h3 className="text-center py-3">Related Posts</h3>
                    </div>
                    {this.state.posts.map((post, i) => (
                        <div className="col-lg-8 col-12 series-title mx-auto my-3" key={i}>
                            <Link
                                to={`/post/${post._id}`}
                                className="text-decoration-none"
                            >
                                <div className="d-block p-2 series-chapter">
                                    <h4>{post.title}</h4>
                                    <small>Posted on: {new Date(post.created).toDateString()}</small>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        )
    }
}
