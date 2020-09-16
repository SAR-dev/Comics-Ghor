import React, { Component } from 'react';
import { list } from './apiSeries';
import { Link } from 'react-router-dom';
import SecondaryLayout from '../core/SecondaryLayout';
import Img from 'react-image';
import LoadingModal from '../core/LoadingModal';
import LoaderSvg from '../images/rings.svg';
import SeoHelmet from '../core/SeoHelmet';
import Moment from 'react-moment';

class Series extends Component {
	constructor() {
		super();
		this.state = {
			series: [],
			initializing: true
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		list().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				console.log(data.series)
				this.setState({ series: data.series, initializing: false });
			}
		});
	}

	render() {
		const { series, initializing } = this.state;
		return (
			<>
			<SeoHelmet title="Series" />
			<SecondaryLayout>
					<div className="w-full">
						<Link to="/series/new/create">
						<div className="flex flex-wrap p-4 bg-gray-800 rounded shadow mx-2 my-4 transition duration-500 ease-in-out transform hover:-translate-y-1">
								<div className="px-5 py-2 w-2/4 rounded-lg bg-gray-900 text-sm md:text-xl text-white font-light">
									Create your series ...
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
					</div>
					<div className="w-full flex flex-wrap">
					{series.map((single, i) => (
						<>
						{single._id !== `${process.env.REACT_APP_NONE_SERIES}` && (
						<div className="w-full sm:w-1/2 lg:w-full my-2" key={i}>
							<div className="flex flex-wrap p-2 mx-1 bg-gray-800 shadow rounded relative">
								<div className="lg:w-1/3 w-full overflow-hidden">
									<Img
										src={`https://i.imgur.com/${single.image}m.png`}
										className="w-full h-48 object-cover rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-125"
										loader={<img src={LoaderSvg} className="h-48 mx-auto" />}
									/>
								</div>
								<div style={{minHeight: 180}} className="relative lg:w-2/3 w-full text-xs md:text-sm text-white lg:pl-4 px-2">
									<Link to={`/series/${single._id}`}>
										<h4 className="text-base md:text-xl font-semibold">
											{single.name.length > 25 ? (
												single.name.slice(0, 25).concat('  ...')
											) : (
												single.name
											)}
										</h4>
										<div className="md:block leading-tight md:leading-normal pl-4 text-xs border-l border-dashed border-gray-500 mt-4">
											{single.shortSummary}...
										</div>
									</Link>
									<div className="w-full absolute bottom-0 left-0 lg:ml-4">
										<Img
											src={`https://i.imgur.com/${single.createdBy.avatar}s.png`}
											className="h-8 w-8 object-cover rounded-full border-2 border-gray-300 shadow"
										/>
										<Link to={`/user/${single.createdBy._id}`}>
											<h6 className="absolute left-0 bottom-0 text-sm ml-10 mb-2 font-semibold text-white hover:text-gray-200">
												{single.createdBy.name}
											</h6>
										</Link>
										<h6 className="absolute bottom-0 right-0 mr-4 mb-2 text-white text-xs">
											{<Moment fromNow>{new Date(single.created)}</Moment>}
										</h6>
									</div>
								</div>
							</div>
						</div>
						)}
						</>
					))}
					</div>
					
				<LoadingModal trigger={initializing} text="INITIALIZING" />
			</SecondaryLayout>
			</>
		);
	}
}

export default Series;
