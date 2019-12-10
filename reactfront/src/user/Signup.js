import React, { Component } from 'react'
import Tick from '../images/tick.gif';
import { Link } from 'react-router-dom';
import { signup } from '../auth/auth';

class Signup extends Component {
    constructor() {
        super()
        this.state = {
            name: "",
            nameError: true,
            email: "",
            emailError: true,
            password: "",
            passwordError: true,
            created: false,
            loading: false,
            error: ""
        }
    };

    resetError = () => {
        this.setState({ error: "" , loading: false })
    }

    handleName = (name) => (event) => {
        if (event.target.value.length < 3 || event.target.value.length > 20) {
            this.setState({ nameError: true, name: event.target.value })
        } else {
            this.setState({ nameError: false, name: event.target.value })
        }
    };

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
        const { name, email, password } = this.state
        const user = {
            name, email, password
        };
        signup(user)
            .then(data => {
                if (data.error) {
                    this.setState({ loading: true, error: data.error })
                } else {
                    this.setState({ 
                        name: "",
                        nameError: true,
                        email: "",
                        emailError: true,
                        password: "",
                        passwordError: true,
                        error: "",
                        created: true
                     })
                }
            })
    };

    signupForm = ( name, email, password, loading, nameError, emailError, passwordError ) => (
        <form>
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                </div>
                <input value={ name } onChange={ this.handleName("name") } className={ nameError ? "form-control is-invalid" : "form-control is-valid"} placeholder="Username" type="text" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Username should contain 3 to 20 characters</div>
            </div>
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                </div>
                <input value={email} onChange={ this.handleEmail("email") }  className={ emailError ? "form-control is-invalid" : "form-control is-valid"} placeholder="Email address" type="email" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Please provide a valid email</div>
            </div>
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                </div>
                <input value={password} onChange={ this.handlePassword("password") }  className={ passwordError ? "form-control is-invalid" : "form-control is-valid"} placeholder="Create password" type="password" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Password must contain at least 6 characters and 1 number</div>
            </div>                                   
            <div className="form-group">
                <button 
                    onClick={ this.clickSubmit } 
                    className={ loading ? "d-none" : "btn btn-primary btn-block"} 
                    disabled={ nameError|| emailError|| passwordError|| !name || !email || !password ? true : false }
                > Create Account
                </button>
                <button 
                    onClick={ this.clickSubmit } 
                    className={ loading ? "btn btn-primary btn-block" : "d-none"} 
                    disabled 
                >
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Checking...
                </button>
            </div>    
            <p className="text-center">Have an account? <Link to="/signin" style={{textDecoration: "none"}}>Sign In</Link> </p>
        </form>
     );

    render() {
        const { name, email,  password, loading, error, nameError, emailError, passwordError } = this.state
        return (
            <>
            <div className="container">
                <div className="row justify-content-center">
                <div className={ this.state.created ? "d-none" : "col-6 sign my-5" }>
                    <div className="card bg-light">
                        <article className="card-body mx-auto" style={{width: "80%"}}>
                            <h4 className="card-title mt-3 text-center">Sign Up</h4>
                            <p className="text-center">Get started with your free account</p>
                            <p>
                                <a href="" className="btn btn-twitter"> <i className="fab fa-twitter"></i> Sign in with Twitter</a>
                                <a href="" className="btn btn-facebook float-right"> <i className="fab fa-facebook-f"></i> Sign in with Facebook</a>
                            </p>
                            <p className="divider-text">
                                <span className="bg-light">OR</span>
                            </p>
                            { this.signupForm( name, email, password, loading, nameError, emailError, passwordError ) }
                        </article>
                    </div>
                </div>

                    <div className={ this.state.created ? "col-6 text-center" : "d-none" } style={{ marginTop: "150px" }}>
                        <img className="mb-5" src={ Tick } style={{ height: "80px" }} alt="Successful!" />
                        <h4 className="text-success px-2">Account successfully created. Please <Link style={{ textDecoration: "none" }} to="/signin">Sign in</Link></h4>
                    </div>
                    
                </div>
            </div>

            <div className={ error ? "modal fade show d-block blurred" : "modal fade" } tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-danger"> <i className="material-icons text-danger float-left" style={{marginTop: "3px", marginRight: "3px"}}>error</i><span>ERROR!</span></h5>
                        <button onClick={ this.resetError } type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <i className="material-icons">cancel</i>
                        </button>
                    </div>
                    <div className="modal-body">
                        { `${ error }` }
                    </div>
                    </div>
                </div>
            </div>

            </>
        )
    }
};

export default Signup;
