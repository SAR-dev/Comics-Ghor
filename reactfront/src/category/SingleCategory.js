import React, { Component } from 'react';
import { catDataById, catById } from './apiCat';
import PostCardAlt from '../post/PostCardAlt';
import PrimaryLayout from '../core/PrimaryLayout';
import LoadingModal from '../core/LoadingModal';
import Img from 'react-image';
import LoaderSvg from '../images/rings.svg';
import SeoHelmet from '../core/SeoHelmet';

class SingleCategory extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			check: false,
			likes: '',
			initializing: true,
			catData: ''
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		const catId = this.props.match.params.catId;
		this.init(catId)
	}

	init = (catId) => {
			catDataById(catId).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					this.setState({ posts: data });
				}
			});
			catById(catId).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					this.setState({ catData: data, initializing: false });
				}
			});
	}

	render() {
		const { posts, initializing, catData } = this.state;
		return (
			<>
			<SeoHelmet title={catData.name} desc={catData.summary} image={`https://i.imgur.com/${catData.image}m.png`} />
			<PrimaryLayout>
				<div className="max-w-screen-lg mx-auto">
					<div className="flex">
						<div className="w-full h-64 px-2 mb-5 relative">
							<Img
								src={`https://i.imgur.com/${catData.image}l.png`}
								alt="Cover"
								className="h-64 w-full object-cover"
								loader={<img src={LoaderSvg} className="h-64 w-full mx-auto" />}
							/>
							<h1 className="text-sm font-semibold text-white bg-gray-800 shadow-lg absolute bottom-0 left-0 rounded-full px-5 py-2 ml-5 mb-5 uppercase tracking-widest">
								{catData.name}
							</h1>
						</div>
					</div>

					<div
						className="mx-2 bg-gray-800 border-t-4 border-gray-600 rounded-b text-white shadow px-4 py-3 mb-5 border border-gray-700"
						role="alert"
					>
						<div className="flex">
							<div className="py-1">
								<svg
									className="fill-current h-6 w-6 text-white mr-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
								</svg>
							</div>
							<div>
                                <p className="font-bold">{catData.name} related post policy</p>
								<p className="text-sm">{catData.summary}</p>
							</div>
						</div>
					</div>
					{posts && (
						<div className="flex flex-wrap">
							{posts.map((post, i) => (
								<div className="lg:w-1/3 md:w-1/2 w-full p-2" key={i}>
									<PostCardAlt post={post} />
								</div>
							))}
						</div>
					)}
				</div>
				<LoadingModal trigger={initializing} text="INITIALIZING" />
			</PrimaryLayout>
			</>
		);
	}
}

export default SingleCategory;
