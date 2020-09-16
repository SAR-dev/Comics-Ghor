import React, { Component } from 'react'
import jwt from 'jsonwebtoken';
import PrimaryLayout from '../core/PrimaryLayout';
import { signup, signout } from '../auth/auth';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import LoadingModal from '../core/LoadingModal';
import Welcome from '../images/super-thank-you.svg';

class Activate extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            email: '',
            password: '',
            token: '',
            error: '',
            loading: false,
            showModal: false,
            expired: false,
            exp: '',
            success: false
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false, error: '', loading: false });
	}

    componentDidMount() {
        signout(() => "")
        var dateNow = new Date();
        const token = this.props.match.params.token
        if (token) {
            const data = jwt.decode(token)
            this.setState({name: data.name, email: data.email, password: data.password, token: token, exp: data.exp})
            if (data.exp*1000 < dateNow.getTime()) {
                this.setState({expired: true})
            }
        }
    }

    clickSubmit = (event) => {
        event.preventDefault()
        this.setState({ loading: true })
        const { name, email, password } = this.state
        const user = {
            name, email, password
        };
        signup(user)
            .then(data => {
                if (data.error) {
                    this.setState({ loading: true, error: data.error, showModal: true  })
                } else {
                    this.setState({ 
                        name: "",
                        email: "",
                        password: "",
                        error: "",
                        loading: false,
                        success: true
                     })
                }
            })
    };

    render() {
        const {name, error, loading, expired, success} = this.state

        return (
            <PrimaryLayout>
                {!expired && !success && (
                    <div className="max-w-screen-md mx-auto">
                    <div className="my-12 text-center py-4 lg:px-4">
                        <div onClick={this.clickSubmit} className="cursor-pointer hover:bg-indigo-900 px-5 py-3 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                            <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-lg font-bold trcking-wider mr-3">Ready!</span>
                            <span className="font-semibold mr-2 text-left flex-auto text-lg tracking-wide">Hey {name}, Click here to activate your account ?</span>
                            <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                        </div>
                    </div>
                    <img src={Welcome} className="h-64 mx-auto" />
                    </div>
                )}
                {expired && !success && (
                    <div className="max-w-screen-md mx-auto">
                    <div className="my-12 text-center py-4 lg:px-4">
                        <div className="px-5 py-3 bg-pink-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                            <span className="flex rounded-full bg-pink-500 uppercase px-2 py-1 text-lg font-bold trcking-wider mr-3">Sorry!</span>
                            <span className="font-semibold mr-2 text-left flex-auto text-lg tracking-wide">Hey {name}, Your token expired. Please signup again</span>
                            <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                        </div>
                    </div>
                    <img src={Welcome} className="h-64 mx-auto" />
                    </div>
                )}
                {success && (
                    <>
                    <div className="max-w-screen-md mx-auto">
                    <div className="my-12 text-center py-4 lg:px-4">
                        <div className="px-5 py-3 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                            <span className="flex rounded-full bg-indigo-600 uppercase px-2 py-1 text-lg font-bold trcking-wider mr-3">Success!</span>
                            <span className="font-semibold mr-2 text-left flex-auto text-lg tracking-wide">Congratulations! Your Sign Up was successfully completed.</span>
                            <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                        </div>
                    </div>
                    <img src={Welcome} className="h-64 mx-auto" />
                    </div>
                    <div className="max-w-screen-md my-5 mx-auto text-center">
                        <Link to="/signin" className="px-5 py-3 bg-teal-600 text-white hover:bg-teal-700 rounded text-center font-semibold text-lg">Click here to Sign In</Link>
                    </div>
                    </>
                )}
                
                <LoadingModal trigger={loading} text="CHECKING..." />
                <Modal
					isOpen={error.length > 0}
                    contentLabel="Minimal Modal Example"
                    className="border-0 bg-transparent max-w-lg mx-auto mt-10"
                >
                    <div className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0" style={{marginTop: 150}}>
                        <div className="my-5">
                            <h1 className="text-2xl text-white font-semibold pb-5">Error !</h1>
							<p className="text-sm text-white">{`${error}`}</p>
                        </div>
                        <div className="mt-10 mb-5">
                            <button
                                className="px-3 py-2 rounded bg-white font-semibold"
                                onClick={this.handleCloseModal}
                            >
                                GOT IT
                            </button>
                        </div>
                    </div>
                </Modal>
            </PrimaryLayout>
        )
    }
}

export default Activate;
