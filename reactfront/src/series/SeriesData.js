import React, { Component } from 'react';
import { seriesById, remove } from './apiSeries';
import { isAuthenticated } from '../auth/auth';
import { Link, Redirect } from 'react-router-dom';
import Img from 'react-image';
import LoaderSvg from '../images/rings.svg';
import SeoHelmet from '../core/SeoHelmet';
import Modal from 'react-modal';

export default class SeriesData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			series: '',
			createdBy: '',
			avatar: '',
			creatorId: '',
			redirectToHome: false,
			check: false
		};
	}
	componentDidMount() {
		const seriesId = this.props.seriesDataId;
		seriesById(seriesId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				console.log(data);
				this.setState({
					series: data,
					createdBy: data.createdBy.name,
					avatar: data.createdBy.avatar,
					creatorId: data.createdBy._id
				});
			}
		});
	}

	checkDeleteSeries = () => {
		this.setState({ check: true });
	};

	cancelDeleteSeries = () => {
		this.setState({ check: false });
	};

	deleteSeries = () => {
		const seriesId = this.props.seriesDataId;
		const token = isAuthenticated().token;
		remove(seriesId, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ redirectToHome: true });
			}
		});
	};

	render() {
		const { series, createdBy, avatar, creatorId, redirectToHome, check } = this.state;
		if (redirectToHome) {
			return <Redirect to={'/'} />
		}
		return (
			<>
			<SeoHelmet title={series.name} desc={series.summary ? series.summary : series.name} image={`https://i.imgur.com/${series.image}m.png`} />
			<div className="w-full mb-5">
				<div className="w-full mb-5">
					<Img
						src={`https://i.imgur.com/${series.image}.png`}
						className="h-64 text-center object-cover"
						loader={<img src={LoaderSvg} className="h-64 mx-auto" />} 
					/>
				</div>
				<div className="w-full relative">
					<h1 className="text-2xl font-semibold text-cream pb-3 mb-3 border-b border-gray-300">{series.name}</h1>
					<div className="whitespace-pre-wrap tracking-wide text-base my-4 text-cream">
						<h6 className="text-base font-bold tracking-wider mb-2">SUMMARY :</h6>
						{series.summary}
					</div>
					{isAuthenticated().user &&
					isAuthenticated().user.role === "admin" && (
						<div>
							<Link
								className="absolute bottom-0 right-0 bg-white border-2 border-gray-700 font-semibold text-gray-700 rounded px-2 py-1 hover:bg-gray-700 hover:text-white"
								to={`/series/edit/${this.state.series._id}`}
							>
								Admin Edit
							</Link>
						</div>
					)}
				</div>
				<div className="w-full my-5 relative">
					<Img
						src={`https://i.imgur.com/${avatar}m.png`}
						className="w-10 h-10 object-cover border-2 border-gray-800 shadow rounded-full"
					/>
					<Link to={`/user/${creatorId}`}>
					<h4 className="absolute bottom-0 left-0 text-lg text-white font-semibold mb-1 ml-12">
						{createdBy}
					</h4>
					</Link>
					{isAuthenticated().user &&
					isAuthenticated().user._id === creatorId && (
						<div>
							<Link
								className="absolute bottom-0 right-0 px-2 py-1 text-gray-700 font-semibold tracking-wider bg-yellow-400 border-2 border-yellow-500 rounded text-sm hover:bg-yellow-500"
								to={`/series/edit/${this.state.series._id}`}
							>
								<i className="fas fa-pen mr-1"></i>Edit
							</Link>
							<button
								className="absolute bottom-0 mr-20 right-0 px-2 py-1 text-gray-700 font-semibold tracking-wider bg-pink-400 border-2 border-pink-500 rounded text-sm hover:bg-pink-500"
								onClick={this.checkDeleteSeries}
							>
								<i className="fas fa-trash-restore-alt mr-1"></i>Delete
							</button>
						</div>
					)}
				</div>
			</div>
			<Modal
					isOpen={check}
					contentLabel="Minimal Modal Example"
					className="border-0 bg-transparent max-w-lg mx-auto mt-10"
				>
					<div
						className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0"
						style={{ marginTop: 150 }}
					>
						<div className="my-5">
							<h1 className="text-2xl text-white font-semibold pb-5">Warning !</h1>
							<p className="text-sm text-white">Do you really want to delete this series ?</p>
						</div>
						<div className="mt-10 mb-5">
							<button className="px-3 py-2 mr-2 rounded bg-white font-semibold" onClick={this.deleteSeries}>
								Delete
							</button>
							<button
								className="px-3 py-2 ml-2 rounded bg-white font-semibold"
								onClick={this.cancelDeleteSeries}
							>
								Cancel
							</button>
						</div>
					</div>
				</Modal>
			</>
		);
	}
}
