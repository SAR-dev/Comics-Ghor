import React, { Component } from 'react';
import { list } from './apiCat';
import { Link } from 'react-router-dom';
import 'react-perfect-scrollbar/dist/css/styles.css';
import RSC from "react-scrollbars-custom";

class Category extends Component {
	constructor() {
		super();
		this.state = {
            cat: [],
		};
	}

	componentDidMount() {
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
			<div className="px-4 my-4 flex flex-wrap bg-gray-800 shadow rounded pb-4">
                <h1 className="text-xl text-white tracking-wider font-semibold uppercase my-4 text-center w-full"><i className="fas fa-swatchbook pr-2 text-green-600"></i>Categories</h1>
                <RSC style={{height: "500px"}}>
				<div className="flex flex-wrap">
				{cat.map((item, i) => (
                    <Link to={`/category/${item._id}`} className="w-full py-2 px-4 my-3 bg-gray-900 shadow rounded-full text-white transition duration-500 ease-in-out transform hover:-translate-y-1" key={i}>
                        <div className="items-center w-full leading-none flex lg:inline-flex" role="alert">
                            <span className="font-semibold mr-2 text-left flex-auto">{item.name}</span>
                            <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                        </div>
                    </Link>
                ))}
				</div>
				</RSC>
            </div>
		);
	}
}

export default Category;
