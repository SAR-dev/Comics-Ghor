import React, { Component } from 'react';
import { isAuthenticated } from '../auth/auth';
import { imageupload, singlePost, update, listSeries } from './apiPost';
import { Redirect } from 'react-router-dom';
import Uploading from '../images/uploading.gif';
import CUpdater from './Updater';
import './Editor.css';

class EditPost extends Component {
    constructor() {
        super()
        this.handleImage = this.handleImage.bind(this);
        this.state = {
            id: "",
            title: "",
            titleError: false,
            body: "",
            bodyError: false,
            image: [],
            imageError: false,
            error: "",
            uploading: false,
            loading: false,
            user: {},
            redirectToHome: false,
            series: [],
            seriesOf: "",
        }
    };

    componentDidMount() {
        this.updatepostData = new FormData();
        const postId = this.props.match.params.postId
        this.init(postId);
        listSeries().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ series: data.series });
            }
        });
    };

    init = (postId) => {
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    const image = data.image[0].split(",")
                    this.setState({
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        image: image,
                        seriesOf: data.seriesOf._id,
                    })
                }
            })
    };

    handleTitle = () => (event) => {
        if (event.target.value.length < 1 || event.target.value.length > 100) {
            this.setState({ titleError: true, title: event.target.value })
            this.updatepostData.set('title', event.target.value)
        } else {
            this.setState({ titleError: false, title: event.target.value })
            this.updatepostData.set('title', event.target.value)
        }
    };

    handleBody = (htmldata) => {
        if (htmldata.length < 10 || htmldata.length > 20000) {
            this.setState({ bodyError: true, body: htmldata })
            this.updatepostData.set('body', htmldata)
        } else {
            this.setState({ bodyError: false, body: htmldata })
            this.updatepostData.set('body', htmldata)
        }
    }

    handleSeriesOf = (event) => {
        this.setState({ seriesOf: event.target.value });
        this.updatepostData.set('seriesOf', event.target.value)
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
                let imgArray = this.state.image
                imgArray.push(res.data.id)
                this.setState({ image: imgArray, imageError: false, uploading: false })
                this.updatepostData.set('image', imgArray)
            }
            )
        }
    };

    deleteImage = (e, i) => {
        e.preventDefault();
        let imgList = this.state.image
        imgList.splice(i, 1)
        this.setState({ image: imgList })
        this.updatepostData.set('image', imgList)
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

        const postId = this.state.id
        const token = isAuthenticated().token

        update(postId, token, this.updatepostData)
            .then(data => {
                if (data.error) {
                    this.setState({ loading: true, error: data.error })
                } else {
                    this.setState({
                        title: "",
                        titleError: false,
                        body: "",
                        bodyError: false,
                        image: [],
                        imageError: false,
                        error: "",
                        uploading: false,
                        loading: false,
                        user: {},
                        redirectToHome: true,
                        series: [],
                        seriesOf: ""
                    })
                }
            })
    };

    createPost = (series, title, body, image, titleError, bodyError, imageError, error, uploading, loading, user, redirectToHome) => (
        <form>
            <div className="form-group row pb-2">
                <label htmlFor="title" className="text-info fs-small fw-700 mb-1">Give an awesome title!</label>
                <input id="title" value={title} onChange={this.handleTitle("title")} className={titleError ? "form-control form-control-sm is-invalid" : "form-control form-control-sm is-valid"} type="text" style={{ backgroundImage: "none", boxShadow: "none" }} />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Title is required and should not exceed 100 characters</div>
            </div>
            <div className="row mb-4">
                <div className="col-12" style={{padding: "0px"}}>
                    <label className="text-info fs-small fw-700 mb-1">Write something awesome</label>
                    <CUpdater
                        value={this.state.body}
                        data={this.handleBody.bind(this)}
                    />
                    <div className={bodyError ? "d-none" : "ml-1 body-error-none"}>Looks good!</div>
                    <div className={bodyError ? "ml-1 body-error" : "d-none"}>Body is required</div>
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="dropdownSelect" className="text-info fs-small fw-700 mb-1">Select Series</label>
                <select className="form-control form-control-sm" id="dropdownSelect" value={this.state.seriesOf} onChange={this.handleSeriesOf}>
                    <option disabled style={{ display: "none" }}></option>
                    {series.map((item, i) => {
                        return (<option value={item._id} key={i}>{item.name}</option>)
                    })}
                </select>
                <div className={this.state.seriesOf ? "body-error-none" : "d-none"} style={{ marginLeft: "1px" }}>Looks good!</div>
                <div className={this.state.seriesOf ? "d-none" : "body-error"} style={{ marginLeft: "1px" }}>Select a series</div>
            </div>
            <div className="row">
                <small className="text-info fs-small fw-700 mb-1">Upload images</small>
            </div>
            <div className="row mb-1">
                {image.map((image, i) => {
                    return (
                        <div className="col-2 px-0 mr-2" key={i}>
                            <img src={`https://i.imgur.com/${image}s.jpg`} style={{ height: "126px", width: "126px", objectFit: "cover", borderRadius: "5px" }} />
                            <button className="btn btn-sm image-del" onClick={(e) => this.deleteImage(e, i)}><i className="fas fa-trash text-danger"></i></button>
                        </div>
                    )
                })}

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
                    disabled={titleError || bodyError || imageError || !this.state.seriesOf ? true : false}
                > Update Post
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
        const { series, title, body, image, titleError, bodyError, imageError, error, uploading, loading, user, redirectToHome } = this.state
        if (redirectToHome) {
            return <Redirect to={"/"} />
        }
        return (
            <>
                <div className="container new-post">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 col-11 mx-auto my-5">
                            {this.createPost(series, title, body, image, titleError, bodyError, imageError, error, uploading, loading, user, redirectToHome)}
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
                            <div className="modal-body" style={{ background: "white", border: "none", textAlign: "center" }}>
                                <img src={Uploading} style={{ height: "150px" }} />
                            </div>
                        </div>
                    </div>
                </div>


            </>
        )
    }
}

export default EditPost;