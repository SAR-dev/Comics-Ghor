import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth/auth';
import Logo from '../images/logo.png';
import ReactTooltip from 'react-tooltip';
import {isMobile} from 'react-device-detect';
import Img from 'react-image';
import LoaderSvg from '../images/rings.svg';
import Notification from '../notification/Notification';

class Menu extends Component {
	constructor() {
		super();
		this.state = {
			expanded: true,
			avatar: '',
			signedIn: false
		};
	}

	componentDidMount(){
		if (isAuthenticated()){
			let avatar = isAuthenticated().user.avatar
			this.setState({avatar: avatar, signedIn: true})
		}
	}

	clickOut = () => {
		this.setState({expanded: !this.state.expanded, signedIn: false})
		this.props.history.push("/signin")
	}

	render() {
		const {avatar, signedIn} = this.state
		return (
			<>
			{signedIn && <Notification /> }
			<nav className="flex items-center justify-between flex-wrap bg-gray-800 shadow px-10">
				<div className="flex items-center flex-shrink-0 text-white relative w-48 py-4">
					<Link to="/">
						<img src={Logo} className="border-2 border-gray-800 shadow rounded-full h-10" alt="Logo" />
						<span className="font-bold text-lg absolute top-0 mt-4 ml-12 welcome-font tracking-widest">CGSN</span>
						<span className="text-xs absolute top-0 ml-12 tracking-tighter" style={{marginTop: 38}}>Comics Ghor Social Network</span>
						<span className="px-1 rounded bg-yellow-500 textwhite absolute text-xs absolute top-0 left-0 mt-5" style={{marginLeft: 105}}>Beta</span>
					</Link>
				</div>
				<div className="block lg:hidden">
					<button onClick={() => this.setState({ expanded: !this.state.expanded })} className="flex items-center px-3 py-2 border rounded text-gray-400 border-gray-400 hover:text-white hover:border-white">
						<svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<title>Menu</title>
							<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
						</svg>
					</button>
				</div>
				<div className={this.state.expanded ? "w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden" : "w-full block flex-grow lg:flex lg:items-center lg:w-auto pb-5 lg:pb-0"}>
					<div className="lg:flex-grow lg:text-right">
						<Link
							onClick={() => this.setState({ expanded: !this.state.expanded })}
							className="block lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
							to="/"
							data-tip="News Feed"
							data-for='home'
						>
							{!isMobile && <ReactTooltip place="bottom" id="home" type="light" effect="solid"/>}
							<i className="fas fa-fan spin px-2 text-lg"></i>
							<span className="inline-block lg:hidden">Home</span>
						</Link>
						<Link
							onClick={() => this.setState({ expanded: !this.state.expanded })}
							className="block lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
							to="/categories"
							data-tip="Categories"
							data-for="cat"
						>
							{!isMobile && <ReactTooltip place="bottom" id="cat" type="light" effect="solid"/>}
							<i className="fas fa-swatchbook px-2"></i>
							<span className="inline-block lg:hidden">Categories</span>
						</Link>
						<Link
							onClick={() => this.setState({ expanded: !this.state.expanded })}
							className="block lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
							to="/series"
							data-tip="Series"
							data-for="series"
						>
							{!isMobile && <ReactTooltip place="bottom" id="series" type="light" effect="solid"/>}
							<i className="fas fa-layer-group px-2"></i>
							<span className="inline-block lg:hidden">Series</span>
						</Link>
						<Link
							onClick={() => this.setState({ expanded: !this.state.expanded })}
							className="block lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
							to="/search"
							data-tip="Search Posts and Users"
							data-for="posts"
						>
							{!isMobile && <ReactTooltip place="bottom" id="posts" type="light" effect="solid"/>}
							<i className="fas fa-search px-2"></i>
							<span className="inline-block lg:hidden">Search</span>
						</Link>
						<Link
							onClick={() => this.setState({ expanded: !this.state.expanded })}
							className="block lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
							to="/help"
							data-tip="Need Help ?"
							data-for="help"
						>
							{!isMobile && <ReactTooltip place="bottom" id="help" type="light" effect="solid"/>}
							<i className="fas fa-question-circle px-2"></i>
							<span className="inline-block lg:hidden">Help</span>
						</Link>
						{isAuthenticated() && (
							<>
							<Link
								onClick={() => this.setState({ expanded: !this.state.expanded })}
								className="block lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
								to='/chat/message'
								data-tip="Lets Chat !"
								data-for="chat"
							>
								{!isMobile && <ReactTooltip place="bottom" id="chat" type="light" effect="solid"/>}
								<i className="fas fa-comment-alt px-2"></i>
								<span className="inline-block lg:hidden">Messages</span>
							</Link>
							<div
								className="block cursor-pointer lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
								onClick={() => signout(() => this.clickOut())}
								data-tip="Sign Out"
								data-for="out"
							>
								{!isMobile && <ReactTooltip place="bottom" id="out" type="light" effect="solid"/>}
								<i className="fas fa-sign-out-alt px-2"></i>
								<span className="inline-block lg:hidden">Sign Out</span>
							</div>
							</>
						)}
					</div>
					<div>
						{!isAuthenticated() && (
							<>
								<Link
									onClick={() => this.setState({ expanded: !this.state.expanded })}
									className="block lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
									to="/signin"
								>
									<i className="fas fa-sign-in-alt px-2"></i>Sign In
								</Link>
								<Link
									onClick={() => this.setState({ expanded: !this.state.expanded })}
									className="block lg:inline-block lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
									to="/signup"
								>
									<i className="fas fa-user-plus px-2"></i>Sign Up
								</Link>
							</>
						)}
						{isAuthenticated() && (
							<>
								<Link
									onClick={() => this.setState({ expanded: !this.state.expanded })}
									className="hidden lg:inline-block lg:mx-1 text-sm mx-3 shadow my-2 border-2 border-white rounded-full"
									to={`/user/${isAuthenticated().user._id}`}
									data-tip={isAuthenticated().user.name}
									data-for="profile"
								>
									<Img src={avatar.length > 0 ? `https://i.imgur.com/${avatar}s.png` : "https://i.imgur.com/lJR3DFp.png"} className="border-2 border-gray-800 rounded-full h-10" alt="avatar" loader={<img src={LoaderSvg} className="h-10 text-center" />} />
									{!isMobile && <ReactTooltip place="left" id="profile" type="light" effect="solid"/>}
								</Link>
								<Link
									onClick={() => this.setState({ expanded: !this.state.expanded })}
									className="block lg:hidden lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-0"
									to={`/user/${isAuthenticated().user._id}`}
								>
									<i className="fas fa-user-circle px-2"></i>{isAuthenticated().user.name}
								</Link>
							</>
						)}
						{isAuthenticated() && isAuthenticated().user.role === "admin" && (
							<Link
								onClick={() => this.setState({ expanded: !this.state.expanded })}
								className="block lg:inline-block lg:float-right lg:mx-1 text-sm px-3 py-2 leading-none border rounded text-white border-transparent hover:border-transparent hover:text-gray-700 hover:bg-white mt-4 lg:mt-4"
								to="/admin"
							>
								<i className="fas fa-user-shield px-2"></i>Admin
							</Link>
						)}
					</div>
				</div>
			</nav>
			</>
		);
	}
}

export default withRouter(Menu);
