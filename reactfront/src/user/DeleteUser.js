import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth';
import { remove } from './apiUser';
import { signout } from '../auth/auth';

class DeleteUser extends Component {
    constructor() {
        super()
        this.state = {
            load: false,
            redirect: false
        }
    };

    resetError = () => {
        this.setState({load: false})
    };

    deleteCheck = () => {
        this.setState({load: true})
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
            <button className="btn del mx-1" onClick={this.deleteCheck}> 
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
            </div>
            </>
        )
    }
}

export default DeleteUser;