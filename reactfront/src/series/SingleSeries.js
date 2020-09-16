import React, { Component } from 'react';
import { seriesDataById } from './apiSeries';
import SeriesData from './SeriesData';
import { Link } from "react-router-dom";
import PrimaryLayout from '../core/PrimaryLayout';
import LoadingModal from '../core/LoadingModal';
import Moment from 'react-moment';

export default class SingleSeries extends Component {
    constructor() {
        super()
        this.state = {
            posts: [],
            initializing: true
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
                    this.setState({ posts: data, initializing: false })
                }
            })
    }
    render() {
        const seriesDataId = this.props.match.params.seriesId
        const {initializing, posts} = this.state
        return (
            <PrimaryLayout>
                <div className="flex flex-wrap max-w-screen-md p-2 mx-auto my-10">
                    <SeriesData seriesDataId={seriesDataId} />
                    <div className="w-full">
                        <h4 className="text-xl uppercase font-semibold text-white pb-2 border-b border-dashed border-gray-600">
                            <i className="fas fa-angle-double-right text-xl mr-2"></i>Related Posts
                        </h4>
                        <div className="flex flex-wrap">
                            {posts.map((post, i) => (
                                <div className="w-full my-4" key={i}>
                                    <Link to={`/post/${post._id}`}>
                                    <h4 className="text-cream text-lg font-semibold">
                                        {post.title}
                                    </h4>
                                    </Link>
                                    <h4 className="text-cream text-sm pl-3">
                                        --- {new Date(post.created).toDateString()}
                                    </h4>
                                    <h4 className="text-cream text-sm pl-3">
                                        --- <Moment fromNow>{new Date(post.created)}</Moment>
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <LoadingModal trigger={initializing} text="INITIALIZING" />
            </PrimaryLayout>
            
        )
    }
}
