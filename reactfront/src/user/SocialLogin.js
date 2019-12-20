import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin } from "../auth";
import { authenticate } from '../auth/auth'

class SocialLogin extends Component {
    constructor() {
        super();
        this.state = {
            redirectToReferrer: false
        };
    }

    responseGoogle = response => {
        console.log(response);
        const { googleId, name, email, imageUrl } = response.profileObj;
        const user = {
            password: googleId,
            name: name,
            email: email,
            imageUrl: imageUrl
        };
        // console.log("user obj to social login: ", user);
        socialLogin(user).then(data => {
            console.log("signin data: ", data);
            if (data.error) {
                console.log("Error Login. Please try again..");
            } else {
                console.log("signin success - setting jwt: ", data);
                authenticate(data, () => {
                    this.setState({ redirectToReferrer: true });
                });
            }
        });
    };

    render() {
        const { redirectToReferrer } = this.state;
        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }
        return (
            <p className="social-btn">
                {/* <button href="" className="btn btn-google"><i class="fab fa-google"></i> Sign in with Google</button> */}
                {/* <a href="" className="btn btn-facebook float-right"> <i className="fab fa-facebook-f"></i> Sign in with Facebook</a> */}
                <GoogleLogin
                    clientId="332113154440-17tkstjc5hjn5at28t7388najb29c6ph.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    className="btn-google"
                />
            </p>
        );
    }
}

export default SocialLogin;