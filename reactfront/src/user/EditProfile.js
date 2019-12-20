import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { read, update, imageupload, updateUser } from './apiUser';
import { Redirect } from 'react-router-dom';
import Loading from '../images/loading.jpg';
import './EditProfile.css';

class EditProfile extends Component {
    constructor() {
        super()
        this.handleAvatar = this.handleAvatar.bind(this);
        this.handleCover = this.handleCover.bind(this);
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            avatar: "",
            cover: "",
            about: "",
            Sinstagram: "",
            Sfacebook: "",
            Stwitter: "",
            Syoutube: "",
            nameError: false,
            passwordError: false,
            emailError: false,
            loading: false,
            avatarError: false,
            coverError: false,
            aboutError: false,
            error: "",
            redirectToProfile: false,
            created: "",
            uploading: false,
        }
    };

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId);
    };

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        created: data.created,
                        avatar: data.avatar,
                        cover: data.cover,
                        about: data.about,
                        Sinstagram: data.Sinstagram,
                        Sfacebook: data.Sfacebook,
                        Stwitter: data.Stwitter,
                        Syoutube: data.Syoutube
                    })
                }
            })
    };

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

    handleAbout = (about) => (event) => {
        if (event.target.value.length < 1) {
            this.setState({ aboutError: true, about: event.target.value })
        } else {
            this.setState({ aboutError: false, about: event.target.value })
        }
    };

    handleSocial = (i) => (event) => {
        this.setState({ [i]: event.target.value })
    }

    handleAvatar(event) {
        this.setState({ uploading: true })
        var fileInput = false
        if (!event.target.files[0] || event.target.files[0].size > 19922944) {
            this.setState({ avatarError: true, uploading: false })
        }
        if (event.target.files[0]) {
            fileInput = true
        }
        if (fileInput) {
            var img = event.target.files[0]
            imageupload(img).then(res => {
                this.setState({ avatar: res.data.id, avatarError: false, uploading: false })
            }
            )
        }
    };

    handleCover(event) {
        this.setState({ uploading: true })
        var fileInput = false
        if (!event.target.files[0] || event.target.files[0].size > 19922944) {
            this.setState({ coverError: true, uploading: false })
        }
        if (event.target.files[0]) {
            fileInput = true
        }
        if (fileInput) {
            var img = event.target.files[0]
            imageupload(img).then(res => {
                this.setState({ cover: res.data.id, coverError: false, uploading: false })
            }
            )
        }
    };

    handlePassword = (password) => (event) => {
        var re = /\d/
        if ((event.target.value.length < 6 && event.target.value.length > 0) || !re.test(event.target.value)) {
            this.setState({ passwordError: true, password: event.target.value })
        } else {
            this.setState({ passwordError: false, password: event.target.value })
        }
    };


    redirectToProfile = () => {
        this.setState({ redirectToProfile: true })
    };

    resetError = () => {
        this.setState({ error: "", loading: false })
    };

    clickSubmit = (event) => {
        event.preventDefault()
        this.setState({ loading: true })
        const { name, email, password, avatar, cover, about, Sinstagram, Sfacebook, Stwitter, Syoutube } = this.state
        const user = {
            name, email, password: password || undefined, avatar, cover, about, Sinstagram, Sfacebook, Stwitter, Syoutube
        };
        const userId = this.props.match.params.userId
        const token = isAuthenticated().token
        update(userId, token, user)
            .then(data => {
                if (data.error) {
                    this.setState({ loading: true, error: data.error })
                } else {
                    updateUser(data.user, () => {
                        this.setState({
                            redirectToProfile: true
                        })
                    })
                }
            })
    };

    updateForm = (name, email, password, avatar, cover, Sinstagram, Sfacebook, Stwitter, Syoutube, nameError, emailError, passwordError, avatarError, coverError, about, aboutError, loading) => (
        <form>
            <div className="form-group row pb-2">
                <small className="text-info fs-small fw-700 mb-1">What is your nickname?</small>
                <input id="name" value={name} onChange={this.handleName("name")} className={nameError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} placeholder="Full name" type="text" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Username should contain 3 to 20 characters</div>
            </div>

            <div className="form-group row pb-2">
                <small className="text-info fs-small fw-700 mb-1">What is your contact email?</small>
                <input value={email} onChange={this.handleEmail("email")} className={emailError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} placeholder="Email address" type="email" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Please provide a valid email</div>
            </div>

            <div className="form-group row pb-2">
                <small className="text-info fs-small fw-700 mb-1">Write something about yourself</small>
                <textarea rows="5" value={about} onChange={this.handleAbout("about")} className={aboutError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} placeholder="About Yourself" type="text" />
                <div className="valid-feedback">Write something to introduce yourself to others</div>
                <div className="invalid-feedback">Do you really want to leave it empty?</div>
            </div>

            <div className="form-group row pb-2 social-input">
                <small className="text-info fs-small fw-700 mb-1">Share your socal links</small>
                <div className={Sinstagram ? "input-group mb-2 valid" : "input-group mb-2 invalid"}>
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fab fa-instagram"></i>
                        </div>
                    </div>
                    <input value={Sinstagram} type="text" onChange={this.handleSocial("Sinstagram")} className="form-control form-control-sm" id="instagram" placeholder="Instagram link" />
                </div>
                <div className={Sfacebook ? "input-group mb-2 valid" : "input-group mb-2 invalid"}>
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fab fa-facebook"></i>
                        </div>
                    </div>
                    <input value={Sfacebook} type="text" onChange={this.handleSocial("Sfacebook")} className="form-control form-control-sm" id="facebook" placeholder="Facebook Profile or Page link" />
                </div>
                <div className={Stwitter ? "input-group mb-2 valid" : "input-group mb-2 invalid"}>
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fab fa-twitter"></i>
                        </div>
                    </div>
                    <input value={Stwitter} type="text" onChange={this.handleSocial("Stwitter")} className="form-control form-control-sm" id="twitter" placeholder="Twitter Profile link" />
                </div>
                <div className={Syoutube ? "input-group mb-2 valid" : "input-group mb-2 invalid"}>
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fab fa-youtube"></i>
                        </div>
                    </div>
                    <input value={Syoutube} type="text" onChange={this.handleSocial("Syoutube")} className="form-control form-control-sm" id="youtube" placeholder="Youtube Channel link" />
                </div>
            </div>

            <div className="form-group row pb-2 avatar-upload">
                <small className="text-info fs-small fw-700 mb-1 col-12 px-0">Update your Avatar photo.</small>
                <div className="col-12 px-0">
                    <img src={`https://i.imgur.com/${avatar}m.jpg`} className="up" />
                </div>
                <label htmlFor="avatar-input">
                    <small className="col-12 px-1">
                        <span className="text-secondary">Click to upload your avatar photo</span>
                        <i className="material-icons text-secondary">photo</i>
                    </small>
                </label>
                <input type="file" accept="image/*" onChange={this.handleAvatar} id="avatar-input" className={avatarError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Please upload a valid image with size less than 20MB</div>
            </div>

            <div className="form-group row pb-2 cover-upload">
                <small className="text-info fs-small fw-700 mb-1 col-12 px-0">Update your Cover photo.</small>
                <div className="col-12 px-0">
                    <img src={`https://i.imgur.com/${cover}m.jpg`} className="up" />
                </div>
                <label htmlFor="cover-input">
                    <small className="col-12 px-1">
                        <span className="text-secondary">Click to upload your cover photo</span>
                        <i className="material-icons text-secondary">photo</i>
                    </small>
                </label>
                <input type="file" accept="image/*" onChange={this.handleCover} id="cover-input" className={coverError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Please upload a valid image with size less than 20MB</div>
            </div>

            <div className="form-group row pb-2">
                <small className="text-info fs-small fw-700 mb-1">Please type your new password.</small>
                <input value={password} onChange={this.handlePassword("password")} className={passwordError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} placeholder="Input password" type="password" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Password must contain at least 6 characters and 1 number</div>
            </div>
            <div className="form-group row">
                <button
                    onClick={this.clickSubmit}
                    className={loading ? "d-none" : "btn btn-sm btn-primary"}
                    disabled={nameError || emailError || passwordError || !name || !email || avatarError || coverError ? true : false}
                > Update
                </button>
                <button
                    onClick={this.clickSubmit}
                    className={loading ? "btn btn-sm btn-primary" : "d-none"}
                    disabled
                >
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Checking...
                </button>
                <button
                    className="btn btn-sm btn-warning text-white ml-3"
                    onClick={this.redirectToProfile}>
                    Cancel
                </button>
            </div>

        </form>
    )

    render() {
        const { name, email, password, avatar, cover, Sinstagram, Sfacebook, Stwitter, Syoutube, nameError, emailError, passwordError, avatarError, coverError, about, aboutError, loading, redirectToProfile, id, error, created, uploading } = this.state
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }
        return (
            <>
                <div className="container px-0">
                    <div className="row">
                        <div className="col-12 col-lg-6 bg-white full-screen">
                            <div className="row cover-photo">
                                <img src={`https://i.imgur.com/${cover}h.png`} />
                            </div>
                            <div className="row profile-photo">
                                <img src={`https://i.imgur.com/${avatar}m.png`} />
                                <div className="profile-footer">
                                    <p className="username text-primary">{name}</p>
                                    <p className="email text-muted"><i className="material-icons">email</i> <span>{email} </span></p>
                                    <p className="joined text-muted">
                                        <i className="material-icons">add_circle</i>
                                        <span>{`Joined ${new Date(created).getFullYear()}`}</span>
                                    </p>
                                </div>
                            </div>
                            {about && (
                                <div className="about-yourself mx-3 my-4">
                                    <h6 className="text-primary"><i className="fas fa-theater-masks mr-2 text-primary"></i>ABOUT ME</h6>
                                    <p className="text-muted">{about}</p>
                                </div>
                            )}
                            <div className="d-flex my-2 mx-3 social-icons justify-content-start">
                                {Sinstagram && (<a className="text-primary mr-3" href={`${Sinstagram}`} target="_blank"><i className="fab fa-instagram"></i></a>)}
                                {Sfacebook && (<a className="text-primary mr-3" href={`${Sfacebook}`} target="_blank"><i className="fab fa-facebook"></i></a>)}
                                {Stwitter && (<a className="text-primary mr-3" href={`${Stwitter}`} target="_blank"><i className="fab fa-twitter"></i></a>)}
                                {Syoutube && (<a className="text-primary mr-3" href={`${Syoutube}`} target="_blank"><i className="fab fa-youtube"></i></a>)}
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 bg-white p-5">
                            {this.updateForm(name, email, password, avatar, cover, Sinstagram, Sfacebook, Stwitter, Syoutube, nameError, emailError, passwordError, avatarError, coverError, about, aboutError, loading)}
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

                <div className={uploading ? "loading-state modal fade show d-block blurred" : "modal fade"} tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body" style={{ background: "transparent", border: "none", textAlign: "center" }}>
                                <img src={Loading} style={{ height: "300px" }} />
                            </div>
                        </div>
                    </div>
                </div>


            </>
        )
    }
}

export default EditProfile;