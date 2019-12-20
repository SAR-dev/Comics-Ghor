import React, { Component } from "react";
import { resetPassword } from "../auth";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            message: "",
            error: "",
            passwordError: true
        };
    }

    resetPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });

        resetPassword({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message, newPassword: "" });
            }
        });
    };

    handlePassword = (newPassword) => (event) => {
        var re = /\d/
        if (event.target.value.length < 6 || !re.test(event.target.value)) {
            this.setState({ passwordError: true, newPassword: event.target.value })
        } else {
            this.setState({ passwordError: false, newPassword: event.target.value })
        }
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-8 col-md-10 mx-auto bg-light my-5 py-5" style={{ minHeight: "300px", borderRadius: "10px" }}>
                        <h2 className="display-4">HI THERE!</h2>
                        <p className="text-secondary">Welcome to Comics Ghor. Type your new password.</p>
                        {this.state.message && (
                            <p className="text-light bg-secondary p-2" style={{ borderRadius: "5px" }}>{this.state.message}</p>
                        )}
                        {this.state.error && (
                            <p className="text-light bg-warning p-2" style={{ borderRadius: "5px" }}>{this.state.error}</p>
                        )}

                        <form>
                            <div className="form-group my-4">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Your new password"
                                    value={this.state.newPassword}
                                    name="newPassword" 
                                    onChange={ this.handlePassword("newPassword") }  className={ this.state.passwordError ? "form-control is-invalid" : "form-control is-valid"}
                                    autoFocus
                                />
                                <div className="valid-feedback">Looks good!</div>
                                <div className="invalid-feedback">Password must contain at least 6 characters and 1 number</div>
                            </div>
                            <button
                                onClick={this.resetPassword}
                                className="btn btn-raised btn-primary"
                                disabled={this.state.passwordError ? true: false}
                            >
                                Reset Password
                    </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ResetPassword;