import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';

class SideBar extends Component {
	constructor() {
		super();
		this.state = {
            menu: [
				{name: 'Posts', route: '/', icon: 'fas fa-paragraph px-2 text-red-600'},
				{name: 'Series', route: '/series', icon: 'fas fa-layer-group px-2 text-yellow-500'},
				{name: 'Categories', route: '/categories', icon: 'fas fa-swatchbook px-2 text-green-600'},
				{name: 'Search', route: '/search', icon: 'fas fa-search px-2 text-teal-600'},
				{name: 'Messages', route: '/chat/message', icon: 'fas fa-comment-alt px-2 text-pink-700'},
			],
			name: 'Anonymous',
			avatar: 'lJR3DFp',
			id: '',
			email: ''
		};
	}

	componentDidMount() {
		if (isAuthenticated()){
			this.setState({
				name: isAuthenticated().user.name, 
				avatar: isAuthenticated().user.avatar,
				id: isAuthenticated().user._id,
				email: isAuthenticated().user.email,
			})
		}
	}

	render() {
		const { menu, avatar, name, id, email} = this.state;
		return (
			<div className="px-4 my-4 flex flex-wrap bg-gray-800 shadow rounded py-4">
				<div className="w-full text-center text-white my-4">
					<Link to={id ? `/user/${id}` : '/signin'}>
						<img src={`https://i.imgur.com/${avatar}m.png`} alt="avatar" className="rounded-full border-2 border-white h-20 w-20 object-cover mx-auto" />
						<h6 className="text-white text-lg tracking-wide font-semibold">{name}</h6>
						<h6 className="text-white text-sm font-light">{email}</h6>
					</Link>
				</div>
				<Link to={id ? `/user/${id}` : '/signin'} className="w-full lg:py-2 py-3 px-4 my-3 bg-gray-900 shadow rounded-full text-white transition duration-500 ease-in-out transform hover:-translate-y-1">
					<div className="items-center w-full leading-none flex lg:inline-flex" role="alert">
						<i className="fas fa-user-circle px-2 text-blue-600"></i>
						<span className="font-semibold mr-2 text-left flex-auto">Profile</span>
						<svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
					</div>
				</Link>
                {menu.map((item, i) => (
                    <Link to={item.route} className="w-full lg:py-2 py-3 px-4 my-3 bg-gray-900 shadow rounded-full text-white transition duration-500 ease-in-out transform hover:-translate-y-1" key={i}>
                        <div className="items-center w-full leading-none flex lg:inline-flex" role="alert">
                            <i className={item.icon}></i>
							<span className="font-semibold mr-2 text-left flex-auto">{item.name}</span>
                            <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                        </div>
                    </Link>
                ))}
            </div>
		);
	}
}

export default SideBar;
