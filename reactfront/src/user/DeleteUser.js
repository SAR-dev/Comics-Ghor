import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';
import { remove } from './apiUser';
import { signout } from '../auth/auth';
import Modal from 'react-modal';

class DeleteUser extends Component {
    constructor() {
        super()
        this.state = {
            showModal: false,
            redirect: false
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
    };

    handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
        this.deleteAccount()
		this.setState({ showModal: false});
	}

    resetError = () => {
        this.setState({load: false})
    };

    deleteCheck = () => {
        this.setState({showModal: true})
    };

    deleteAccount = () => {
        const token = isAuthenticated().token
        const userId = this.props.userId
        remove(userId, token)
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    signout(() => {
                        console.log("User is deleted")
                    })
                    this.setState({redirect: true})
                }
            })
    };

    render() {
        if(this.state.redirect) {
            return <Redirect to="/" />
        }

        return (
            <>
            <button className="px-4 py-2 text-sm shadow bg-gray-600 text-white rounded" onClick={this.deleteCheck}>
                Delete User
            </button>
            <Modal
					isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    className="border-0 bg-transparent max-w-lg mx-auto mt-10"
                >
                    <div className="bg-gray-900 rounded py-5 px-10 border-gray-600 mt-10 mx-5 md:mx-0" style={{marginTop: 150}}>
                        <div className="my-5">
                            <h1 className="text-2xl text-white font-semibold pb-5">WARNING !</h1>
							<p className="text-sm text-white">Are you sure? If you click "YES" this profile will be deleted. To cancel this operation click the "X" button above.</p>
                        </div>
                        <div className="mt-10 mb-5">
                            <button
                                className="px-3 py-2 rounded bg-white font-semibold"
                                onClick={this.handleCloseModal}
                            >
                                YES
                            </button>
                        </div>
                    </div>
                </Modal>
            {/* <button className="btn del mx-1" onClick={this.deleteCheck}> 
                <i className="material-icons">delete</i> 
            </button>

            <div className={ this.state.load ? "modal fade show d-block blurred" : "modal fade" } tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-warning"> <i className="material-icons text-warning float-left" style={{marginTop: "3px", marginRight: "3px"}}>warning</i> WARNING!!</h5>
                            <button onClick={ this.resetError } type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <i className="material-icons">cancel</i>
                            </button>
                        </div>
                        <div className="modal-body">
                            Are you sure? If you click "YES" you will remove your profile from our database. If you click "NO" your profile will remain unchanged.
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger px-4" onClick={this.deleteAccount}>Yes</button>
                            <button type="button" className="btn btn-success px-4" onClick={this.resetError}>No</button>
                        </div>
                    </div>
                </div>
            </div> */}
            </>
        )
    }
}

export default DeleteUser;