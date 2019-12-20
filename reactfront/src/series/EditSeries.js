import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { imageupload, update, seriesById } from './apiSeries';
import { Redirect } from 'react-router-dom';
import Uploading from '../images/uploading.gif';
import '../post/Editor.css';

class EditSeries extends Component {
    constructor() {
        super()
        this.handleImage = this.handleImage.bind(this);
        this.state = {
            id: "",
            name: "",
            nameError: false,
            summary: "",
            summaryError: false,
            image: "",
            imageError: false,
            error: "",
            uploading: false,
            loading: false,
            user: {},
            redirectToHome: false,
        }
    };

    componentDidMount() {
        this.postData = new FormData();
        const seriesId = this.props.match.params.seriesId
        this.init(seriesId);
    };

    init = (seriesId) => {
        seriesById(seriesId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        summary: data.summary,
                        image: data.image,
                        user: data.user,
                    })
                }
            })
    };

    handleName = () => (event) => {
        if (event.target.value.length < 1 || event.target.value.length > 100) {
            this.setState({ nameError: true, name: event.target.value})
            this.postData.set('name', event.target.value)
        } else {
            this.setState({ nameError: false, name: event.target.value })
            this.postData.set('name', event.target.value)
        }
    };

    handleSummary = () => (event) => {
        if (event.target.value.length < 1) {
            this.setState({ summaryError: true, summary: event.target.value})
            this.postData.set('summary', event.target.value)
        } else {
            this.setState({ summaryError: false, summary: event.target.value })
            this.postData.set('summary', event.target.value)
        }
    }

    handleImage(event) {
        this.setState({ uploading: true })
        var fileInput = false
        if (!event.target.files[0] || event.target.files[0].size > 19922944) {
            this.setState({ imageError: true, uploading: false })
        }
        if (event.target.files[0]) {
            fileInput = true
        }
        if (fileInput) {
            var img = event.target.files[0]
            imageupload(img).then(res => {
                this.setState({ image: res.data.id, imageError: false, uploading: false })
                this.postData.set('image', res.data.id)
            }
            )
        }
    };

    deleteImage = (e, i) => {
        e.preventDefault();
        this.setState({image: ""})
        this.postData.set('image', "")
    };

    redirectToHome = () => {
        this.setState({ redirectToHome: true })
    };

    resetError = () => {
        this.setState({ error: "", loading: false })
    };


    clickSubmit = (event) => {
        event.preventDefault()
        this.setState({ loading: true })

        const seriesId = this.state.id
        const token = isAuthenticated().token

        update(seriesId, token, this.postData)
            .then(data => {
                if (data.error) {
                    this.setState({ loading: true, error: data.error })
                } else {
                    this.setState({
                        name: "",
                        nameError: true,
                        summary: "",
                        summaryError: true,
                        image: "",
                        imageError: false,
                        error: "",
                        uploading: false,
                        loading: false,
                        user: {},
                        redirectToHome: true,
                    })
                }
            })
    };

    createPost = (name, summary, image, nameError, summaryError, imageError, error, uploading, loading, user, redirectToHome) => (
        <form>
            <div className="form-group row pb-2">
            <small className="text-info fs-small fw-700 mb-1">Give an awesome Name to your series!</small>
                <input id="name" value={name} onChange={this.handleName("name")} className={nameError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} placeholder="Write a name" type="text" style={{boxShadow: "none"}} />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Name is required and should not exceed 100 characters</div>
            </div>

            <div className="form-group row pb-2">
                <small className="text-info fs-small fw-700 mb-1">Write a summary</small>
                <textarea rows="5" id="summary" value={summary} onChange={this.handleSummary("summary")} className={summaryError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} placeholder="Start writing..." type="text" style={{boxShadow: "none"}} />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Do you really want to leave it empty?</div>
            </div>
            <div className="row">
                <small className="text-info fs-small fw-700 mb-1">Upload a cover photo for your series</small>
            </div>
            <div className="row mb-1">
                {image.length > 1 && (
                        <div className="col-2 px-0 mr-2">
                            <img src={`https://i.imgur.com/${image}s.jpg`} style={{height: "126px", width: "126px", objectFit: "cover", borderRadius: "5px"}}/>
                            <button className="btn btn-sm image-del" onClick={(e)=>this.deleteImage(e)}><i className="fas fa-trash text-danger"></i></button>
                        </div>
                    )
                }
                
                <div className="col-2 px-0 box">
                    <label htmlFor="image-input" className="mb-0">
                        <i className="fas fa-camera camera"></i>
                    </label>
                <input type="file" accept="image/*" onChange={this.handleImage} id="image-input" className={imageError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} />      
                </div>
            </div>
            <div className={imageError ? "d-none" : "row body-error-none mb-3"}>Looks good!</div>
            <div className={imageError ? "row body-error mb-3" : "d-none"}>Please upload a valid image with size less than 20MB</div>

            <div className="form-group row">
                <button
                    onClick={this.clickSubmit}
                    className={loading ? "d-none" : "btn btn-sm btn-primary"}
                    disabled={nameError || summaryError ? true : false}
                > Update Series
                </button>
                <button
                    className={loading ? "btn btn-sm btn-primary" : "d-none"}
                    disabled
                >
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Checking...
                </button>
                <button
                    className="btn btn-sm btn-warning text-white ml-3"
                    onClick={this.redirectToHome}>
                    Cancel
                </button>
            </div>

        </form>
    )

    render() {
        const { name, summary, image, nameError, summaryError, imageError, error, uploading, loading, user, redirectToHome } = this.state
        if (redirectToHome) {
            return <Redirect to={"/"} />
        }
        return (
            <>
                <div className="container new-post">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 col-11 mx-auto my-5">
                            {this.createPost (name, summary, image, nameError, summaryError, imageError, error, uploading, loading, user, redirectToHome)}
                        </div>
                    </div>
                </div>

                <div className={error ? "modal fade show d-block blurred" : "modal fade"} tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-name text-danger"> <i className="material-icons text-danger float-left" style={{ marginTop: "3px", marginRight: "3px" }}>error</i><span>ERROR!</span></h5>
                                <button onClick={this.resetError} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <i className="material-icons">cancel</i>
                                </button>
                            </div>
                            <div className="modal-summary">
                                {`${error}`}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={uploading ? "loading-state modal fade show d-block blurred" : "modal fade"} tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-summary" style={{background: "white", border: "none", textAlign: "center"}}>
                                <img src={Uploading} style={{height: "150px"}}/>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        )
    }
}

export default EditSeries;