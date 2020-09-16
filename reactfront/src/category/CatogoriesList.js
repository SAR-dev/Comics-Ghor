import React, { Component } from 'react';
import { list } from './apiCat';
import { Link } from 'react-router-dom';
import SeoHelmet from '../core/SeoHelmet';

class CategoriesList extends Component {
	constructor() {
		super();
		this.state = {
            cat: [],
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);

		list().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ cat: data.cat });
			}
		});
	}

	render() {
		const { cat } = this.state;
		return (
			<>
			<SeoHelmet title="Channels" />
			<div className="container mx-auto my-5 p-5 max-w-screen-md">
				<h1 className="text-3xl mb-2 text-white tracking-widest font-bold">
					CATEGORIES
				</h1>
				<p className="text-sm text-cream mb-5 py-2 text-justify border-b border-gray-400">
					Every post is required to be under a category so that our beloved users can filter their posts easily.
					So whenever you create a post please select relevant category. If you think an additional category is needed, just contact any admin. Thanks.
				</p>
					<div className="flex flex-wrap">
						{cat.map((item, i) => (
						<Link to={`/category/${item._id}`} key={i} className="w-full bg-gray-800 shadow rounded text-cream py-2 px-4 my-2">
							<div className="flex flex-wrap">
								<div className="w-full">
									<h1 className="text-2xl font-semibold text-white tracking-wider">
										{item.name}
									</h1>
									<p className="my-1 text-sm text-justify">
										{item.summary}
									</p>
								</div>
							</div>
						</Link>
						))}
					</div>
            </div>
			</>
		);
	}
}

export default CategoriesList;
