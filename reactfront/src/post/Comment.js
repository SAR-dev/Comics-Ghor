import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth/auth';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { imageupload } from './apiPost';
import ShowMoreText from 'react-show-more-text';
import UploadingImg from '../images/uploading.gif';
import TextareaAutosize from 'react-textarea-autosize';
import { toArray } from 'react-emoji-render';
import './Comment.css'

class Comment extends Component {
    constructor(props) {
        super(props)
        this.handleImageUp = this.handleImageUp.bind(this);
        this.state = {
            text: "",
            image: "",
            imageError: "",
            uploading: false,
            error: "",
            confirm: false,
            commentDel: "",
        }
    };

    parseEmojis = value => {
        const emojisArray = toArray(value);
        
        // toArray outputs React elements for emojis and strings for other
        const newValue = emojisArray.reduce((previous, current) => {
          if (typeof current === "string") {
            return previous + current;
          }
          return previous + current.props.children;
        }, "");
        
        return newValue;
      };
      

    handleChange = (event) => {
        this.setState({ text: event.target.value })
    }

    addComment = (e) => {
        e.preventDefault()
        const userId = isAuthenticated().user._id
        const postId = this.props.postId
        const token = isAuthenticated().token

        comment(userId, token, postId, { text: this.state.text, image: this.state.image })
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ text: "", image: "" })
                    this.props.updateComments(data.comments)
                }
            })
    }

    confirmDeleteComment = (comment) => {
        this.setState({ confirm: true , commentDel: comment})
    }

    cancelDeleteComment = () => {
        this.setState({ confirm: false })
    }

    handleImageUp(event) {
        this.setState({ uploading: true })
        var fileInput = false
        if (!event.target.files[0] || event.target.files[0].size > 19922944) {
            this.setState({
                imageError: true,
                uploading: false
            })
        }
        if (event.target.files[0]) {
            fileInput = true
        }
        if (fileInput) {
            var img = event.target.files[0]
            imageupload(img).then(res => {
                this.setState({
                    image: res.data.id,
                    imageError: false,
                    uploading: false
                })
            }
            )
        }
    };

    deleteComment = () => {
        const userId = isAuthenticated().user._id
        const postId = this.props.postId
        const token = isAuthenticated().token

        uncomment(userId, token, postId, this.state.commentDel)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.props.updateComments(data.comments)
                    this.setState({confirm: false})
                }
            })
    }

    render() {
        const { comments } = this.props
        const { confirm, uploading } = this.state
        
        return (
            <>
                <div id="COMMENTS" className="col-12">
                    <form className="mx-2 py-4">
                        <div className="form-group mb-0">
                            <TextareaAutosize placeholder="Leave a comment" value={this.state.text} type="text" className="form-control" onChange={this.handleChange}></TextareaAutosize>
                            {this.state.image && (
                                <div className="d-inline-block image-uploaded">
                                    <img src={`https://i.imgur.com/${this.state.image}s.png`} />
                                </div>
                            )}
                            <div className="d-inline-block">
                                <label htmlFor="image-input" className="image-input-label">
                                    <i className="fas fa-camera camera"></i>
                                </label>
                                <input type="file" accept="image/*" onChange={this.handleImageUp} id="image-input" className="form-control form-control-sm" />
                            </div>
                            <button disabled={!this.state.text && !this.state.image ? true : false} onClick={this.addComment} className="btn btn-sm btn-block btn-primary send"><i className="fas fa-share mr-1"></i>Submit</button>
                        </div>
                    </form>

                    <div className="row uploaded-comments">
                        <div className="m-2">
                            <span className="fs-small-header text-primary"><i className="fas fa-comment-dots mr-1"></i> {comments.length} COMMENTS</span>
                        </div>
                        <div className="col-12 px-0">
                            <ul className="media-list px-0">
                                {comments.map((comment, i) => (
                                    <li className="media" key={i}>
                                        <Link className="pull-left" to={`/user/${comment.postedBy._id}`}>
                                            <img src={`https://i.imgur.com/${comment.postedBy.avatar}s.png`} alt="" className="img-circle" />
                                        </Link>
                                        <div className="media-body pl-2">
                                            <span className="text-muted pull-right">
                                                <small className="text-muted float-right">
                                                    <Moment fromNow>{new Date(comment.created)}</Moment>
                                                </small>
                                            </span>
                                            <strong className="name">{comment.postedBy.name}</strong>
                                            <div className="text pre-line">
                                    
                                                <ShowMoreText
                                                    lines={3}
                                                    more='Show more'
                                                    less='Show less'
                                                    anchorclassName=''
                                                    onClick={this.executeOnClick}
                                                    expanded={false}
                                                >
                                                    {this.parseEmojis(comment.text)}
                                                </ShowMoreText>

                                            </div>
                                            {comment.image.length > 0 && (
                                                <div className="comment-image">
                                                    <img src={`https://i.imgur.com/${comment.image}m.png`} />
                                                </div>
                                            )}
                                            {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (
                                                <button 
                                                    onClick={() => this.confirmDeleteComment(comment)} 
                                                    className="comment-delete btn btn-sm float-right"
                                                >
                                                    <i className="fas fa-minus-circle mr-1"></i>
                                                    DELETE
                                                </button>
                                            )}
                                        </div>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={confirm ? "loading-state modal fade show d-block blurred" : "modal fade"} tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{ background: "white", border: "1px solid #ccc", textAlign: "center", }}>
                            <div className="modal-body py-5">
                                <h4 className="font-weight-normal">Do you really want to delete this comment?</h4>
                            </div>
                            <div className="modal-footer justify-content-around">
                                <button onClick={this.deleteComment} className="btn btn-outline-danger btn-sm">Yes, I am sure</button>
                                <button onClick={this.cancelDeleteComment} className="btn btn-outline-primary btn-sm">No, go back</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={uploading ? "loading-state modal fade show d-block blurred" : "modal fade"} tabIndex="-1" role="dialog" aria-hidden="true" data-keyboard="false" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body" style={{ background: "white", border: "none", textAlign: "center" }}>
                                <img src={UploadingImg} style={{ height: "150px" }} />
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Comment;