import React, { Component } from 'react';
import { list } from './apiPost';
import PostCard from './PostCard';
import SecondaryLayout from '../core/SecondaryLayout';
import LoadingModal from '../core/LoadingModal';
import { Link } from 'react-router-dom';
import Img from 'react-image';
import SeoHelmet from '../core/SeoHelmet';
import event from './event.json';
import ReactTooltip from 'react-tooltip';
import {isMobile} from 'react-device-detect';

class Posts extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			check: false,
			likes: '',
			initializing: true,
			page: 1,
			x: 0,
			y: 0,
			noPosts: false,
			loading: false,
			event: []
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		this.setState({event: event})
		this.loadPosts(this.state.page);
	}

	loadPosts = (page) => {
		list(page).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ posts: data, initializing: false });
			}
		});
	};

	loadOnScroll = () => {
		var pageNo = this.state.page + 1
		this.setState({page: pageNo, x: window.pageXOffset, y: window.pageYOffset, loading: true})
		list(pageNo).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (data.length > 0) {
					this.setState({ posts: [...this.state.posts, ...data], loading: false });
					window.scrollTo(this.state.x,this.state.y);
				} else {
					this.setState({noPosts: true, loading: false})
				}
			}
		});
	}


	render() {
		const { posts, initializing, noPosts, loading, event } = this.state;
		return (
			<>
			<SeoHelmet title="Home" />
			<SecondaryLayout>
				<div className="w-full">
					<Link to={isMobile ? "/post/create" : "/post/type/select"}>
						<div className="flex flex-wrap p-4 bg-gray-800 rounded shadow mx-2 my-4 transition duration-500 ease-in-out transform hover:-translate-y-1">
							<div className="px-5 py-2 w-2/4 rounded-lg bg-gray-900 text-sm md:text-xl text-white font-light">
								Write a post ...
							</div>
							<div className="py-0 w-1/4 pl-4 pr-2 text-center">
								<div className="p-2 rounded bg-gray-900 shadow-sm text-xl text-white font-light">
									<i className="text-teal-600 fas fa-image" />
								</div>
							</div>
							<div className="py-0 w-1/4 pl-2 pr-4 text-center">
								<div className="p-2 rounded bg-gray-900 shadow-sm text-xl text-white font-light">
									<i className="text-blue-600 fas fa-share" />
								</div>
							</div>
						</div>
					</Link>
					{Object.keys(event).length !== 0 && (
						<div className="flex flex-wrap bg-gray-800 rounded m-2" data-tip={event.name} data-for="event">
							<a href={event.link} target="_blank" rel="noopener noreferrer">
							<div className="w-full p-4">
								<div className="overflow-hidden">
								<Img
									src={event.image}
									alt="Post"
									className="w-full object-cover rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
								/>
								</div>
							</div>
							</a>
							<ReactTooltip place="bottom" type="dark" effect="float" id="event"/>
						</div>
					)}
					<div className="flex flex-wrap">
						{posts.map((post, i) => (
							<div className="w-full p-2" key={i}>
								<PostCard post={post} />
							</div>
						))}
					</div>
					{!noPosts && (
						<div className="flex w-full my-3">
							<button className={loading ? 
									"w-full py-2 bg-gray-800 mx-2 rounded text-sm text-gray-400 text-center pointer-events-none"
									:
									"w-full py-2 bg-gray-800 mx-2 rounded text-sm text-gray-400 text-center"
									} 
									onClick={this.loadOnScroll}
							>
								{!loading && ('Show More ...')}
								{loading && ('Fetching Posts...')}
							</button>
						</div>
					)}
				</div>
				<LoadingModal trigger={initializing} text="INITIALIZING" />
			</SecondaryLayout>
			</>
		);
	}
}

export default Posts;
