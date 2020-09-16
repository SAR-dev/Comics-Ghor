import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import LoaderSvg from '../images/rings.svg';
import Img from 'react-image';

export default class SearchPostCard extends Component {
	render() {
		const { post, key } = this.props;
		return (
			<div className="w-full py-2 px-2 md:px-4 bg-gray-800 shadow rounded my-4" key={key}>
				<Link to={`/post/${post._id}`}>
					<h1 className=" px-4 font-semibold text-xl md:text-2xl text-white">{post.title}</h1>
					<div className="flex flex-wrap my-4">
                        {post.thumbnail !== 'undefined' && (
                            <div className="w-full md:w-1/2 px-4 h-64 overflow-hidden">
                                <LazyLoad offset={100} once>
                                    <Img
                                        src={`https://i.imgur.com/${post.thumbnail}l.png`}
                                        alt="Post"
                                        className="h-64 w-full object-cover rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-125 "
                                        loader={<img src={LoaderSvg} className="h-64 mx-auto" />}
                                    />
                                </LazyLoad>
                            </div>
                        )}
						<div className={post.thumbnail !== 'undefined' ? "w-full my-4 md:my-0 md:w-1/2 text-sm text-cream px-4" : "w-full my-4 md:my-0 text-sm text-cream px-4"}>
							{post.summary}....
							<div className="pt-4">
								<h4 className="text-cream text-sm">
									<i className="fas fa-calendar mr-2" />
									{new Date(post.created).toDateString()}
								</h4>
								<h4 className="text-cream text-sm">
									<i className="fas fa-hourglass-start mr-2" />
									<Moment fromNow>{new Date(post.created)}</Moment>
								</h4>
							</div>
						</div>
					</div>
				</Link>
			</div>
		);
	}
}
