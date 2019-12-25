import React, { Component } from "react";
import { forgotPassword } from "../auth";
import reset from '../images/3180820.png';

class ForgotPassword extends Component {
    state = {
        email: "",
        message: "",
        error: ""
    };

    forgotPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPassword(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message });
            }
        });
    };

    render() {
        return (
            <div className="container">
                <div className="row">

                <div className="col-lg-6 d-none d-lg-block">
                    <img src={reset} className="w-100" style={{marginTop: "70px"}} />
                </div>

                    <div className="col-12 col-lg-6 col-md-10 mx-auto my-5 py-5" style={{ minHeight: "300px", borderRadius: "10px" }}>
                        <h2 className="display-4">HI THERE!</h2>
                        <p className="text-secondary">Forgot your password? Don't worry. We are always with you.</p>

                        {this.state.message && (
                            <p className="text-light bg-secondary p-2" style={{borderRadius: "5px"}}>{this.state.message}</p>
                        )}
                        {this.state.error && (
                            <p className="text-light bg-warning p-2" style={{borderRadius: "5px"}}>{this.state.error}</p>
                        )}

                        <form>
                            <div className="form-group my-4">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Your email address"
                                    value={this.state.email}
                                    name="email"
                                    onChange={e =>
                                        this.setState({
                                            email: e.target.value,
                                            message: "",
                                            error: ""
                                        })
                                    }
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={this.forgotPassword}
                                className="btn btn-raised btn-primary"
                            >
                                Send Password Rest Link
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        );
    }
}

export default ForgotPassword;