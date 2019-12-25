import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import { signin, authenticate } from '../auth/auth';
import SocialLogin from "./SocialLogin";
import sign from '../images/sign.png';
import './SignUpIn.css';

class Signin extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            emailError: true,
            password: "",
            passwordError: true,
            redirectToHome: false,
            loading: false,
            error: ""
        }
    };

    resetError = () => {
        this.setState({ error: "", loading: false })
    }

    handleEmail = (email) => (event) => {
        var re = /\S+@\S+\.\S+/;
        if (re.test(event.target.value)) {
            this.setState({ emailError: false, email: event.target.value })
        } else {
            this.setState({ emailError: true, email: event.target.value })
        }
    };

    handlePassword = (password) => (event) => {
        var re = /\d/
        if (event.target.value.length < 6 || !re.test(event.target.value)) {
            this.setState({ passwordError: true, password: event.target.value })
        } else {
            this.setState({ passwordError: false, password: event.target.value })
        }
    };

    clickSubmit = (event) => {
        event.preventDefault()
        this.setState({ loading: true })
        const { email, password } = this.state
        const user = {
            email, password
        };
        signin(user)
            .then(data => {
                if (data.error) {
                    this.setState({ loading: true, error: data.error })
                } else {
                    authenticate(data, () => {
                        this.setState({ redirectToHome: true })
                    })
                }
            })
    };

    signinForm = (email, password, loading, emailError, passwordError) => (
        <form>
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                </div>
                <input spellcheck="false" value={email} onChange={this.handleEmail("email")} className={emailError ? "form-control is-invalid" : "form-control is-valid"} placeholder="Email Address" type="email" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Please provide a valid email</div>
            </div>
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                </div>
                <input spellcheck="false" value={password} onChange={this.handlePassword("password")} className={passwordError ? "form-control is-invalid" : "form-control is-valid"} placeholder="Input Password" type="password" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Password must contain at least 6 characters and 1 number</div>
            </div>
            <div className="form-group">
                <button
                    onClick={this.clickSubmit}
                    className={loading ? "d-none" : "btn btn-primary btn-block"}
                    disabled={emailError || passwordError || !email || !password ? true : false}
                > Sign In
                </button>
                <button
                    onClick={this.clickSubmit}
                    className={loading ? "btn btn-primary btn-block" : "d-none"}
                    disabled
                >
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Checking...
                </button>
            </div>
            <p className="text-center sign-in-check">Don't have an account? <Link to="/signup" style={{ textDecoration: "none" }}>Sign Up</Link> </p>
            <p>
                <Link to="/forgot-password" className="btn btn-block btn-danger">
                    {" "}
                    Forgot Password?
                </Link>
            </p>
        </form>
    )

    render() {
        const { email, emailError, password, passwordError, redirectToHome, loading, error } = this.state

        if (redirectToHome) {
            return <Redirect to="/" />
        }

        return (
            <>
                <div className="container">
                    <div className="row justify-content-center">

                        <div className="col-lg-6 d-none d-lg-block">
                            <img src={sign} className="w-100" style={{marginTop: "100px"}} />
                        </div>

                        <div className={this.state.created ? "d-none" : "col-lg-6 col-md-8 col-12 sign my-5"}>
                            <div className="card bg-light">
                                <article className="card-body mx-auto" style={{ width: "90%" }}>
                                    <h4 className="card-title mt-3 text-center">WELCOME!</h4>
                                    <p className="card-text text-center">Sign in to get the most out of Comics Ghor</p>
                                    <SocialLogin />
                                    {this.signinForm(email, password, loading, emailError, passwordError)}
                                </article>
                            </div>
                        </div>

                    </div>
                </div>

                <div className={error ? "modal fade show d-block blurred" : "modal fade"} tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger"> <i className="material-icons text-danger float-left" style={{ marginTop: "3px", marginRight: "3px" }}>error</i><span>ERROR!</span></h5>
                                <button onClick={this.resetError} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <i className="material-icons">cancel</i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {`${error}`}
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
};

export default Signin;