import React, { Component } from 'react';
import PrimaryLayout from '../core/PrimaryLayout';
import Posts from '../post/Posts';
import Series from '../series/Series';
import { isAuthenticated } from "../auth/auth";
import { Redirect, Link } from "react-router-dom";
import { list } from '../category/apiCat';

class Admin extends Component {
    constructor(){
        super()
        this.state = {
            redirectToHome: false,
            cat: []
        };
    }

    componentDidMount() {
        if (isAuthenticated().user.role !== "admin") {
            this.setState({ redirectToHome: true });
        }
        list().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ cat: data.cat });
			}
		});
    }

    render() {

        if (this.state.redirectToHome) {
            return <Redirect to="/" />;
        }

        return (
            <PrimaryLayout>
                <div className="flex flex-wrap p-5">
                    <h1 className="text-3xl text-center mx-auto text-teal-700 tracking-wide mt-10 font-bold">
                        WELCOME TO ADMIN FRONTEND
                    </h1>
                </div>
                <div className="w-full text-center">
                    <Link className="mx-10 py-2 block text-gray-600 hover:bg-gray-400 border border-dashed border-gray-500 rounded" to="/category/new/create">Create Category</Link>
                </div>
                <div className="py-2 border-dashed border border-gray-500 my-5 mx-10">
                    <h1 className="text-gray-600 pb-4 text-center">Edit Category</h1>
                    <div className="flex flex-wrap justify-around">
                    {this.state.cat.map((item, i) => (
                        <Link key={i} to={`/category/edit/${item._id}`} className="m-2 px-4 py-1 hover:bg-gray-200 border rounded-full border-gray-500 text-gray-700" >
                            {item.name}
                        </Link>
                    ))}
                    </div>
                </div>
                <div className="w-full">
                    <Posts />
                </div>
                <div className="w-full">
                    <Series />
                </div>
            </PrimaryLayout>
        )
    }
}

export default Admin;
